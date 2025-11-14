import Job from '../models/Job.js';
import LearningResource from '../models/LearningResource.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Interview from '../models/Interview.js';
import { Op } from 'sequelize';

// @desc    Get all jobs (admin)
// @route   GET /api/admin/jobs
// @access  Admin
export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, experienceLevel } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }
    if (type) where.type = type;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// @desc    Create job (admin)
// @route   POST /api/admin/jobs
// @access  Admin
export const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// @desc    Update job (admin)
// @route   PUT /api/admin/jobs/:jobId
// @access  Admin
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await job.update(updates);

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// @desc    Delete job (admin)
// @route   DELETE /api/admin/jobs/:jobId
// @access  Admin
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// @desc    Get all learning resources (admin)
// @route   GET /api/admin/resources
// @access  Admin
export const getAllResources = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, difficulty } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const { count, rows: resources } = await LearningResource.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      resources,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// @desc    Create learning resource (admin)
// @route   POST /api/admin/resources
// @access  Admin
export const createResource = async (req, res) => {
  try {
    const resourceData = req.body;
    const resource = await LearningResource.create(resourceData);

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

// @desc    Update learning resource (admin)
// @route   PUT /api/admin/resources/:resourceId
// @access  Admin
export const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const updates = req.body;

    const resource = await LearningResource.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    await resource.update(updates);

    res.json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

// @desc    Delete learning resource (admin)
// @route   DELETE /api/admin/resources/:resourceId
// @access  Admin
export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await LearningResource.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    await resource.destroy();

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalJobs = await Job.count();
    const totalResources = await LearningResource.count();
    const totalCourses = await Course.count();
    const totalInterviews = await Interview.count();
    const completedInterviews = await Interview.count({ where: { status: 'completed' } });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsers = await User.count({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } }
    });
    const newJobs = await Job.count({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalResources,
        totalCourses,
        totalInterviews,
        completedInterviews,
        recentActivity: {
          newUsers,
          newJobs
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};
