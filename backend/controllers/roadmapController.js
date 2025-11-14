import Roadmap from '../models/Roadmap.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ROADMAP_PROMPT = `You are an expert career development advisor and learning path designer. 
Create a comprehensive, personalized learning roadmap based on the user's information.

Structure the roadmap as follows:
1. Overview with estimated total time and key milestones
2. Phases (typically 3-5 phases): Each phase should have:
   - Phase number and name
   - Duration (in weeks)
   - Learning objectives
   - Topics to learn (array of topic names with brief descriptions)
   - Projects to build (practical applications)
   - Resources (types of learning materials)
3. Application Timeline: When to start applying for jobs/internships
4. Success Metrics: How to measure progress

Return the response in this exact JSON structure:
{
  "overview": {
    "totalDuration": "string (e.g., '3 months')",
    "totalWeeks": number,
    "keyMilestones": ["milestone1", "milestone2"],
    "description": "Brief overview of the learning journey"
  },
  "phases": [
    {
      "phaseNumber": number,
      "phaseName": "string",
      "duration": "string (e.g., '4 weeks')",
      "weeks": number,
      "objectives": ["objective1", "objective2"],
      "topics": [
        {
          "name": "Topic name",
          "description": "What you'll learn",
          "estimatedHours": number
        }
      ],
      "projects": [
        {
          "name": "Project name",
          "description": "Project description",
          "skillsPracticed": ["skill1", "skill2"]
        }
      ],
      "resources": ["resource type 1", "resource type 2"]
    }
  ],
  "applicationTimeline": {
    "startWeek": number,
    "recommendation": "When and how to start applying",
    "preparationTips": ["tip1", "tip2"]
  },
  "successMetrics": ["metric1", "metric2"]
}

User Information:
`;

// @desc    Generate personalized roadmap
// @route   POST /api/roadmaps/generate
// @access  Private
export const generateRoadmap = async (req, res) => {
  try {
    const { targetRole, currentSkills, timeframe, weeklyHours } = req.body;

    if (!targetRole || !timeframe) {
      return res.status(400).json({
        success: false,
        message: 'Target role and timeframe are required'
      });
    }

    // Build user context
    const userContext = {
      targetRole,
      currentSkills: currentSkills || [],
      timeframe,
      weeklyHours: weeklyHours || 10
    };

    console.log('Generating roadmap for:', userContext);

    // Generate roadmap using OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career development advisor. Generate comprehensive learning roadmaps in valid JSON format only.'
        },
        {
          role: 'user',
          content: ROADMAP_PROMPT + JSON.stringify(userContext)
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const roadmapData = JSON.parse(completion.choices[0].message.content);

    console.log('Generated roadmap:', JSON.stringify(roadmapData, null, 2));

    // Save roadmap to database
    const roadmap = await Roadmap.create({
      userId: req.userId,
      targetRole,
      currentSkills,
      timeframe,
      weeklyHours,
      roadmapData,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      roadmapId: roadmap.id,
      roadmap: {
        id: roadmap.id,
        targetRole: roadmap.targetRole,
        timeframe: roadmap.timeframe,
        roadmapData: roadmap.roadmapData,
        createdAt: roadmap.createdAt
      }
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
};

// @desc    Get user's active roadmap
// @route   GET /api/roadmaps/active
// @access  Private
export const getActiveRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      where: {
        userId: req.userId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'No active roadmap found'
      });
    }

    res.json({
      success: true,
      roadmap: {
        id: roadmap.id,
        targetRole: roadmap.targetRole,
        currentSkills: roadmap.currentSkills,
        timeframe: roadmap.timeframe,
        weeklyHours: roadmap.weeklyHours,
        roadmapData: roadmap.roadmapData,
        progress: roadmap.progress,
        status: roadmap.status,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt
      }
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get roadmap',
      error: error.message
    });
  }
};

// @desc    Get roadmap by ID
// @route   GET /api/roadmaps/:roadmapId
// @access  Private
export const getRoadmapById = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findOne({
      where: {
        id: roadmapId,
        userId: req.userId
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.json({
      success: true,
      roadmap: {
        id: roadmap.id,
        targetRole: roadmap.targetRole,
        currentSkills: roadmap.currentSkills,
        timeframe: roadmap.timeframe,
        weeklyHours: roadmap.weeklyHours,
        roadmapData: roadmap.roadmapData,
        progress: roadmap.progress,
        status: roadmap.status,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt
      }
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get roadmap',
      error: error.message
    });
  }
};

// @desc    Update roadmap progress
// @route   PUT /api/roadmaps/:roadmapId/progress
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { progress } = req.body;

    const roadmap = await Roadmap.findOne({
      where: {
        id: roadmapId,
        userId: req.userId
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    roadmap.progress = progress;
    await roadmap.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: roadmap.progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

// @desc    Get all user roadmaps
// @route   GET /api/roadmaps
// @access  Private
export const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'targetRole', 'timeframe', 'status', 'createdAt', 'updatedAt']
    });

    res.json({
      success: true,
      roadmaps
    });
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get roadmaps',
      error: error.message
    });
  }
};

// @desc    Delete roadmap
// @route   DELETE /api/roadmaps/:roadmapId
// @access  Private
export const deleteRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findOne({
      where: {
        id: roadmapId,
        userId: req.userId
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    await roadmap.destroy();

    res.json({
      success: true,
      message: 'Roadmap deleted successfully'
    });
  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete roadmap',
      error: error.message
    });
  }
};
