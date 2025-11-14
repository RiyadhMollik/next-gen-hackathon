import axios from 'axios';
import User from '../models/User.js';
import UserSkill from '../models/UserSkill.js';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8000';

// @desc    Proxy chat request to Python chatbot server
// @route   POST /api/chat
// @access  Private
export const chatWithBot = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Fetch comprehensive user data
    const user = await User.findByPk(req.userId, {
      attributes: {
        exclude: ['password']
      }
    });

    const userSkills = await UserSkill.findAll({
      where: { userId: req.userId },
      attributes: ['skillName', 'proficiency']
    });

    // Parse JSON fields if they are strings
    let workExperience = user.workExperience;
    let projects = user.projects;
    let education = user.education;

    // Handle double-encoded JSON
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

    // Prepare comprehensive user profile data
    const userProfile = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
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
      education: education || [],
      skills: userSkills.map(s => ({
        name: s.skillName,
        proficiency: s.proficiency
      }))
    };

    // Forward request to Python chatbot server with streaming
    const response = await axios({
      method: 'post',
      url: `${CHATBOT_API_URL}/chat`,
      data: {
        query: query,
        user_id: req.userId,
        user_profile: userProfile // Send comprehensive user data
      },
      responseType: 'stream'
    });

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in nginx

    // Pipe the stream from Python server to client
    response.data.pipe(res);

    // Handle errors in the stream
    response.data.on('error', (error) => {
      console.error('Chatbot stream error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('Chatbot proxy error:', error);
    
    // Check if it's a connection error to Python server
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Chatbot service is currently unavailable. Please make sure the Python server is running on port 8000.' 
      });
    }

    res.status(500).json({ 
      message: error.response?.data?.detail || 'Failed to connect to chatbot service' 
    });
  }
};

// @desc    Check chatbot service health
// @route   GET /api/chat/health
// @access  Public
export const chatbotHealth = async (req, res) => {
  try {
    const response = await axios.get(`${CHATBOT_API_URL}/`, { timeout: 5000 });
    res.json({ 
      status: 'online', 
      chatbotStatus: response.data 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'offline', 
      message: 'Chatbot service is not available',
      error: error.code === 'ECONNREFUSED' ? 'Connection refused' : error.message
    });
  }
};
