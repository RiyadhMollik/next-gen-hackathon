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

    // Try to connect to Python service, but provide fallback if unavailable
    try {
      const response = await axios.get(
        `${CHATBOT_API_URL}/job-match/${req.userId}`,
        {
          params: {
            experience,
            track,
            top_n: topN
          },
          timeout: 5000 // Reduced timeout for faster fallback
        }
      );
      
      res.json(response.data);
      return;
    } catch (serviceError) {
      console.warn('Python job matching service unavailable, using fallback:', serviceError.message);
      
      // Fallback: Get dynamic job matches from database
      const jobMatches = await getDynamicJobMatches(req.userId, experience, track, topN);
      res.json(jobMatches);
    }
  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({
      message: 'Failed to get job matches',
      error: error.message 
    });
  }
};

// Helper function to get dynamic job matches from database when Python service is unavailable
const getDynamicJobMatches = async (userId, experience, track, topN) => {
  try {
    // Import Job model
    const Job = await import('../models/Job.js').then(module => module.default);
    
    // Build query based on experience and track
    const whereClause = {};
    
    // Filter by experience level if provided
    if (experience) {
      whereClause.experienceLevel = experience;
    }
    
    // Search for jobs that match the career track in title or description
    if (track) {
      const { Op } = await import('sequelize');
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${track}%` } },
        { description: { [Op.like]: `%${track}%` } },
        { requiredSkills: { [Op.like]: `%${track}%` } }
      ];
    }
    
    // Fetch matching jobs from database
    const jobs = await Job.findAll({
      where: whereClause,
      limit: topN,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 'title', 'company', 'location', 'salary', 
        'description', 'requiredSkills', 'benefits', 
        'experienceLevel', 'jobType', 'createdAt'
      ]
    });
    
    // Transform jobs to match expected format
    const transformedJobs = jobs.map((job, index) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      match_score: Math.max(0.95 - (index * 0.05), 0.5), // Decreasing match score
      description: job.description,
      requirements: job.requiredSkills ? job.requiredSkills.split(',').map(s => s.trim()) : [],
      benefits: job.benefits ? job.benefits.split(',').map(s => s.trim()) : [],
      experience_level: job.experienceLevel,
      job_type: job.jobType
    }));
    
    return {
      user_id: userId,
      experience_level: experience,
      career_track: track,
      total_matches: transformedJobs.length,
      top_matches: transformedJobs,
      generated_at: new Date().toISOString(),
      source: "database_fallback"
    };
  } catch (error) {
    console.error('Error fetching jobs from database:', error);
    return {
      user_id: userId,
      experience_level: experience,
      career_track: track,
      total_matches: 0,
      top_matches: [],
      generated_at: new Date().toISOString(),
      error: "Unable to fetch job matches at this time"
    };
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
