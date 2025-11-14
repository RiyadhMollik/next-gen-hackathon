import Interview from '../models/Interview.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const QUESTION_GENERATION_PROMPT = `You are an expert technical interviewer. Generate interview questions based on the job requirements and candidate's skills.

Create a comprehensive set of interview questions that:
1. Test technical knowledge relevant to the role
2. Assess problem-solving abilities
3. Evaluate soft skills and cultural fit
4. Include behavioral questions
5. Range from basic to advanced difficulty

Return the response in this exact JSON structure:
{
  "questions": [
    {
      "question": "The interview question text",
      "expectedAnswer": "A comprehensive expected answer with key points",
      "category": "Technical|Behavioral|Problem-Solving|System-Design",
      "difficulty": "Easy|Medium|Hard"
    }
  ]
}

Generate 10-15 questions total, with a good mix of categories and difficulties.

Job and Candidate Information:
`;

const FEEDBACK_GENERATION_PROMPT = `You are an expert interview evaluator. Analyze the candidate's answers and provide detailed feedback.

For each question-answer pair, evaluate:
1. Accuracy and completeness
2. Technical depth and understanding
3. Communication clarity
4. Areas of strength
5. Areas for improvement

Also provide:
- Overall performance score (0-100)
- Key strengths
- Areas to improve
- Specific recommendations

Return the response in this exact JSON structure:
{
  "questionFeedback": [
    {
      "questionIndex": number,
      "score": number (0-10),
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "feedback": "Detailed feedback text"
    }
  ],
  "overallScore": number (0-100),
  "overallFeedback": {
    "strengths": ["overall strength1", "overall strength2"],
    "improvements": ["overall improvement1", "overall improvement2"],
    "recommendations": ["recommendation1", "recommendation2"]
  }
}

Interview Data:
`;

// @desc    Generate interview questions
// @route   POST /api/interviews/generate
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, jobDescription, userSkills } = req.body;

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required'
      });
    }

    const context = {
      jobTitle,
      jobDescription: jobDescription || 'Not provided',
      userSkills: userSkills || []
    };

    console.log('Generating interview questions for:', context);

    // Generate questions using OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer. Generate comprehensive interview questions in valid JSON format only.'
        },
        {
          role: 'user',
          content: QUESTION_GENERATION_PROMPT + JSON.stringify(context)
        }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    });

    const questionsData = JSON.parse(completion.choices[0].message.content);

    console.log(`Generated ${questionsData.questions.length} questions`);

    // Create interview session in database
    const interview = await Interview.create({
      userId: req.userId,
      jobTitle,
      jobDescription,
      userSkills,
      questions: questionsData.questions,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      interviewId: interview.id,
      questions: questionsData.questions.map((q, idx) => ({
        index: idx,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty
      }))
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview questions',
      error: error.message
    });
  }
};

// @desc    Start interview session
// @route   PUT /api/interviews/:interviewId/start
// @access  Private
export const startInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.userId
      }
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    interview.status = 'in-progress';
    await interview.save();

    res.json({
      success: true,
      message: 'Interview started',
      interview: {
        id: interview.id,
        questions: interview.questions,
        status: interview.status
      }
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: error.message
    });
  }
};

// @desc    Submit answer for a question
// @route   POST /api/interviews/:interviewId/answer
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { questionIndex, answer } = req.body;

    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.userId
      }
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Parse userAnswers if it's a JSON string
    let userAnswers = interview.userAnswers;
    if (typeof userAnswers === 'string') {
      userAnswers = JSON.parse(userAnswers);
    }
    if (!Array.isArray(userAnswers)) {
      userAnswers = [];
    }

    // Add answer to userAnswers array
    userAnswers.push({
      questionIndex,
      answer,
      timestamp: new Date()
    });

    interview.userAnswers = userAnswers;
    await interview.save();

    // Parse questions if needed for count
    let questions = interview.questions;
    if (typeof questions === 'string') {
      questions = JSON.parse(questions);
    }

    res.json({
      success: true,
      message: 'Answer submitted successfully',
      answeredCount: userAnswers.length,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message
    });
  }
};

// @desc    Complete interview and generate feedback
// @route   POST /api/interviews/:interviewId/complete
// @access  Private
export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { duration } = req.body;

    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.userId
      }
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Parse questions and answers if they are JSON strings
    let questions = interview.questions;
    if (typeof questions === 'string') {
      questions = JSON.parse(questions);
    }

    let userAnswers = interview.userAnswers;
    if (typeof userAnswers === 'string') {
      userAnswers = JSON.parse(userAnswers);
    }

    // Prepare data for feedback generation
    const feedbackContext = {
      questions: questions,
      userAnswers: userAnswers,
      jobTitle: interview.jobTitle
    };

    console.log('Generating feedback for interview:', interviewId);

    // Generate feedback using OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview evaluator. Provide detailed, constructive feedback in valid JSON format only.'
        },
        {
          role: 'user',
          content: FEEDBACK_GENERATION_PROMPT + JSON.stringify(feedbackContext)
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const feedbackData = JSON.parse(completion.choices[0].message.content);

    // Update interview with feedback
    interview.feedback = feedbackData.questionFeedback;
    interview.overallScore = feedbackData.overallScore;
    interview.status = 'completed';
    interview.duration = duration;
    interview.completedAt = new Date();
    await interview.save();

    res.json({
      success: true,
      message: 'Interview completed successfully',
      feedback: {
        questionFeedback: feedbackData.questionFeedback,
        overallScore: feedbackData.overallScore,
        overallFeedback: feedbackData.overallFeedback
      }
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete interview',
      error: error.message
    });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:interviewId
// @access  Private
export const getInterviewById = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.userId
      }
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.json({
      success: true,
      interview: {
        id: interview.id,
        jobTitle: interview.jobTitle,
        jobDescription: interview.jobDescription,
        questions: interview.questions,
        userAnswers: interview.userAnswers,
        feedback: interview.feedback,
        overallScore: interview.overallScore,
        status: interview.status,
        duration: interview.duration,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt
      }
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get interview',
      error: error.message
    });
  }
};

// @desc    Get all user interviews
// @route   GET /api/interviews
// @access  Private
export const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'jobTitle', 'status', 'overallScore', 'createdAt', 'completedAt']
    });

    res.json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get interviews',
      error: error.message
    });
  }
};
