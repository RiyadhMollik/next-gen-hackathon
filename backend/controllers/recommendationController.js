import models from '../models/index.js';
import { Op } from 'sequelize';
import redisClient from '../config/redis.js';

const { User, UserSkill, Job, LearningResource } = models;

// Helper function to calculate skill match percentage
const calculateSkillMatch = (requiredSkills, userSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;
  
  // Parse requiredSkills if it's a JSON string
  const skillsArray = typeof requiredSkills === 'string' 
    ? JSON.parse(requiredSkills) 
    : Array.isArray(requiredSkills) 
      ? requiredSkills 
      : [];

  const userSkillNames = userSkills.map(s => s.skillName.toLowerCase());
  const matchedSkills = skillsArray.filter(skill => 
    userSkillNames.includes(skill.toLowerCase())
  );

  return {
    percentage: Math.round((matchedSkills.length / skillsArray.length) * 100),
    matchedSkills
  };
};

// @desc    Get job recommendations for user
// @route   GET /api/recommendations/jobs
// @access  Private
export const getJobRecommendations = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Check cache first
    const cacheKey = `recommendations:jobs:${userId}`;
    const cachedRecommendations = await redisClient.get(cacheKey);

    if (cachedRecommendations) {
      return res.json({ 
        jobs: JSON.parse(cachedRecommendations),
        cached: true 
      });
    }

    // Get user with skills
    const user = await User.findByPk(userId, {
      include: [{
        model: UserSkill,
        as: 'skills'
      }]
    });

    if (!user || !user.skills || user.skills.length === 0) {
      return res.json({ 
        jobs: [],
        message: 'Add skills to your profile to get personalized recommendations'
      });
    }

    // Get all jobs
    const jobs = await Job.findAll();

    // Calculate match percentage for each job
    const jobsWithMatch = jobs.map(job => {
      const match = calculateSkillMatch(job.requiredSkills, user.skills);
      return {
        ...job.toJSON(),
        matchPercentage: match.percentage,
        matchedSkills: match.matchedSkills
      };
    });

    // Sort by match percentage and filter jobs with at least some match
    const recommendedJobs = jobsWithMatch
      .filter(job => {
        // Include jobs that match experience level or have skill matches
        const experienceMatch = job.experienceLevel === user.experienceLevel;
        const careerTrackMatch = user.preferredCareerTrack && 
          job.careerTrack === user.preferredCareerTrack;
        
        return job.matchPercentage > 0 || experienceMatch || careerTrackMatch;
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 10);

    // Cache for 30 minutes
    await redisClient.set(cacheKey, JSON.stringify(recommendedJobs), { EX: 1800 });

    res.json({ jobs: recommendedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning resource recommendations for user
// @route   GET /api/recommendations/resources
// @access  Private
export const getResourceRecommendations = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Check cache first
    const cacheKey = `recommendations:resources:${userId}`;
    const cachedRecommendations = await redisClient.get(cacheKey);

    if (cachedRecommendations) {
      return res.json({ 
        resources: JSON.parse(cachedRecommendations),
        cached: true 
      });
    }

    // Get user with skills
    const user = await User.findByPk(userId, {
      include: [{
        model: UserSkill,
        as: 'skills'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all learning resources
    const resources = await LearningResource.findAll();

    // If user has skills, recommend resources that match their skills
    // If no skills, recommend beginner resources
    let recommendedResources;

    if (user.skills && user.skills.length > 0) {
      const resourcesWithMatch = resources.map(resource => {
        const match = calculateSkillMatch(resource.relatedSkills, user.skills);
        return {
          ...resource.toJSON(),
          matchPercentage: match.percentage,
          matchedSkills: match.matchedSkills,
          reasons: match.matchedSkills.length > 0 
            ? [`Matches ${match.matchedSkills.length} of your skills`]
            : []
        };
      });

      recommendedResources = resourcesWithMatch
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);
    } else {
      // Recommend beginner resources
      recommendedResources = resources
        .filter(r => r.level === 'Beginner')
        .slice(0, 10)
        .map(r => ({
          ...r.toJSON(),
          reasons: ['Recommended for beginners']
        }));
    }

    // Cache for 30 minutes
    await redisClient.set(cacheKey, JSON.stringify(recommendedResources), { EX: 1800 });

    res.json({ resources: recommendedResources });
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized dashboard data
// @route   GET /api/recommendations/dashboard
// @access  Private
export const getDashboardRecommendations = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get user profile with skills
    const user = await User.findByPk(userId, {
      include: [{
        model: UserSkill,
        as: 'skills'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get top 5 job recommendations
    const jobs = await Job.findAll({ limit: 100 });
    const jobsWithMatch = jobs.map(job => {
      const match = calculateSkillMatch(job.requiredSkills, user.skills || []);
      return {
        ...job.toJSON(),
        matchPercentage: match.percentage,
        matchedSkills: match.matchedSkills
      };
    });

    const topJobs = jobsWithMatch
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);

    // Get top 5 resource recommendations
    const resources = await LearningResource.findAll({ limit: 100 });
    const resourcesWithMatch = resources.map(resource => {
      const match = calculateSkillMatch(resource.relatedSkills, user.skills || []);
      return {
        ...resource.toJSON(),
        matchPercentage: match.percentage,
        reasons: match.matchedSkills.length > 0 
          ? [`Matches ${match.matchedSkills.length} of your skills`]
          : ['Recommended for you']
      };
    });

    const topResources = resourcesWithMatch
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);

    res.json({
      user: {
        fullName: user.fullName,
        educationLevel: user.educationLevel,
        department: user.department,
        experienceLevel: user.experienceLevel,
        preferredCareerTrack: user.preferredCareerTrack,
        skills: user.skills?.map(s => s.skillName) || []
      },
      stats: {
        totalSkills: user.skills?.length || 0,
        recommendedJobs: topJobs.length,
        availableResources: topResources.length
      },
      recommendedJobs: topJobs,
      recommendedResources: topResources
    });
  } catch (error) {
    next(error);
  }
};
