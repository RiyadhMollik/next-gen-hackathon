import axios from 'axios';
import User from '../models/User.js';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8000';

// @desc    Get job matches for current user
// @route   GET /api/job-matching/matches
// @access  Private
export const getJobMatches = async (req, res) => {
  try {
    // Fetch user data to get experience and career track
    const user = await User.findByPk(req.userId, {
      attributes: ['experienceLevel', 'preferredCareerTrack']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get optional query parameters
    const topN = req.query.top_n ? parseInt(req.query.top_n) : 10;
    const experience = req.query.experience || user.experienceLevel;
    const track = req.query.track || user.preferredCareerTrack;

    // Forward request to Python chatbot server
    const response = await axios.get(
      `${CHATBOT_API_URL}/job-match/${req.userId}`,
      {
        params: {
          experience,
          track,
          top_n: topN
        },
        timeout: 30000 // 30 second timeout
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Job matching error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Job matching service is currently unavailable. Please try again later.' 
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.detail || 'Failed to get job matches'
      });
    }

    res.status(500).json({ 
      message: 'Failed to get job matches',
      error: error.message 
    });
  }
};

// @desc    Get job matches with POST (more detailed)
// @route   POST /api/job-matching/matches
// @access  Private
export const postJobMatches = async (req, res) => {
  try {
    // Fetch user data
    const user = await User.findByPk(req.userId, {
      attributes: ['experienceLevel', 'preferredCareerTrack']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { top_n = 10, user_experience, user_track } = req.body;

    // Use provided values or fall back to user profile
    const experience = user_experience || user.experienceLevel;
    const track = user_track || user.preferredCareerTrack;

    // Forward request to Python chatbot server
    const response = await axios.post(
      `${CHATBOT_API_URL}/match-jobs`,
      {
        user_id: req.userId,
        user_experience: experience,
        user_track: track,
        top_n
      },
      { timeout: 30000 }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Job matching error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Job matching service is currently unavailable. Please try again later.' 
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.detail || 'Failed to get job matches'
      });
    }

    res.status(500).json({ 
      message: 'Failed to get job matches',
      error: error.message 
    });
  }
};

// @desc    Chat about job matches
// @route   POST /api/job-matching/chat
// @access  Private
export const chatAboutJobs = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Fetch comprehensive user data (same as chat controller)
    const user = await User.findByPk(req.userId, {
      attributes: {
        exclude: ['password']
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse JSON fields (same logic as chat controller)
    let workExperience = user.workExperience;
    let projects = user.projects;
    let education = user.education;

    if (typeof workExperience === 'string') {
      try {
        workExperience = JSON.parse(workExperience);
        if (typeof workExperience === 'string') {
          workExperience = JSON.parse(workExperience);
        }
      } catch (e) {
        workExperience = [];
      }
    }

    if (typeof projects === 'string') {
      try {
        projects = JSON.parse(projects);
        if (typeof projects === 'string') {
          projects = JSON.parse(projects);
        }
      } catch (e) {
        projects = [];
      }
    }

    if (typeof education === 'string') {
      try {
        education = JSON.parse(education);
        if (typeof education === 'string') {
          education = JSON.parse(education);
        }
      } catch (e) {
        education = [];
      }
    }

    // Prepare user profile
    const userProfile = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      website: user.website,
      summary: user.summary,
      educationLevel: user.educationLevel,
      department: user.department,
      experienceLevel: user.experienceLevel,
      preferredCareerTrack: user.preferredCareerTrack,
      targetRoles: user.targetRoles,
      cvText: user.cvText,
      projectDescriptions: user.projectDescriptions,
      workExperience: workExperience || [],
      projects: projects || [],
      education: education || []
    };

    // Forward request to Python chatbot server with job context
    const response = await axios({
      method: 'post',
      url: `${CHATBOT_API_URL}/chat-with-jobs`,
      data: {
        query: query,
        user_id: req.userId,
        user_profile: userProfile
      },
      responseType: 'stream',
      timeout: 60000 // 60 seconds for AI response
    });

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Pipe the stream
    response.data.pipe(res);

    response.data.on('error', (error) => {
      console.error('Job chat stream error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('Job chat error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Job matching service is currently unavailable.' 
      });
    }

    res.status(500).json({ 
      message: error.response?.data?.detail || 'Failed to chat about jobs' 
    });
  }
};

// @desc    Check job matching service health
// @route   GET /api/job-matching/health
// @access  Public
export const jobMatchingHealth = async (req, res) => {
  try {
    const response = await axios.get(`${CHATBOT_API_URL}/`, { timeout: 5001 });
    res.json({ 
      status: 'online', 
      service: 'job-matching',
      chatbotStatus: response.data 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'offline', 
      service: 'job-matching',
      message: 'Job matching service is not available',
      error: error.code === 'ECONNREFUSED' ? 'Connection refused' : error.message
    });
  }
};
