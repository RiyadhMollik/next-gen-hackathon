import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeBehaviorFrame = async (req, res) => {
  try {
    const { image, timestamp } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
    Analyze this video frame from a mock interview session. Provide a comprehensive behavior analysis focusing on:

    1. Attention & Engagement:
       - Eye contact with camera (0-100 score)
       - Body posture and positioning
       - Signs of distraction or multitasking

    2. Emotional State:
       - Facial expressions and micro-expressions
       - Stress indicators
       - Confidence level assessment

    3. Professional Behavior:
       - Appropriate facial expressions for interview context
       - Professional appearance and setup
       - Background distractions

    4. Suspicious Activities:
       - Looking away frequently (possible screen reading)
       - Unusual hand movements (typing/writing)
       - Multiple people in frame
       - Signs of coaching or assistance

    5. Technical Setup:
       - Lighting quality
       - Camera angle appropriateness
       - Background professionalism

    Return your analysis as JSON with this exact structure:
    {
      "attentionScore": number (0-100),
      "engagementLevel": "low" | "medium" | "high",
      "emotionalState": "nervous" | "confident" | "neutral" | "stressed",
      "confidenceLevel": "low" | "medium" | "high",
      "eyeContact": "poor" | "average" | "good" | "excellent",
      "bodyLanguage": "closed" | "neutral" | "open" | "professional",
      "suspiciousActivities": [array of detected issues],
      "technicalQuality": {
        "lighting": "poor" | "average" | "good",
        "cameraAngle": "poor" | "average" | "good",
        "backgroundQuality": "unprofessional" | "acceptable" | "professional"
      },
      "overallAssessment": "concerning" | "acceptable" | "good" | "excellent",
      "recommendations": [array of improvement suggestions],
      "violations": [array of potential cheating indicators],
      "timestamp": "${timestamp}"
    }

    Be objective and professional in your assessment. Focus on observable behaviors that could indicate interview integrity issues.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const analysisText = response.choices[0].message.content;
    
    // Try to parse JSON from response
    let analysis;
    try {
      // Extract JSON from response if wrapped in markdown or other text
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(analysisText);
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Return a default analysis structure
      analysis = {
        attentionScore: 75,
        engagementLevel: "medium",
        emotionalState: "neutral",
        confidenceLevel: "medium",
        eyeContact: "average",
        bodyLanguage: "neutral",
        suspiciousActivities: [],
        technicalQuality: {
          lighting: "average",
          cameraAngle: "average",
          backgroundQuality: "acceptable"
        },
        overallAssessment: "acceptable",
        recommendations: ["Continue with natural behavior"],
        violations: [],
        timestamp: timestamp,
        error: "Analysis parsing incomplete"
      };
    }

    // Log analysis for debugging
    console.log('Behavior Analysis Result:', analysis);

    res.json({
      success: true,
      analysis: analysis,
      timestamp: timestamp
    });

  } catch (error) {
    console.error('Error in behavior analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze behavior',
      details: error.message
    });
  }
};

const getInterviewBehaviorReport = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Here you would typically fetch stored behavior data from database
    // For now, return a sample report structure
    
    const behaviorReport = {
      interviewId,
      overallScore: 85,
      attentionScore: 88,
      engagementLevel: 'high',
      suspiciousActivitiesCount: 2,
      violationsDetected: [],
      recommendations: [
        'Maintain better eye contact with camera',
        'Ensure consistent lighting throughout interview',
        'Minimize background distractions'
      ],
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      report: behaviorReport
    });

  } catch (error) {
    console.error('Error generating behavior report:', error);
    res.status(500).json({
      error: 'Failed to generate behavior report',
      details: error.message
    });
  }
};

export {
  analyzeBehaviorFrame,
  getInterviewBehaviorReport
};
