import models from '../models/index.js';
import { Op } from 'sequelize';
import redisClient from '../config/redis.js';

const { Job } = models;

// @desc    Get all jobs with filtering
// @route   GET /api/jobs
// @access  Private
export const getAllJobs = async (req, res, next) => {
  try {
    const { search, jobType, experienceLevel, location, page = 1, limit = 20 } = req.query;

    // Build where clause
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    const offset = (page - 1) * limit;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try to get from cache first
    const cacheKey = `job:${id}`;
    const cachedJob = await redisClient.get(cacheKey);

    if (cachedJob) {
      return res.json({ job: JSON.parse(cachedJob), cached: true });
    }

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Cache for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(job), { EX: 3600 });

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job (admin functionality)
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      location,
      jobType,
      experienceLevel,
      salary,
      requiredSkills,
      careerTrack
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      location,
      jobType,
      experienceLevel,
      salary,
      requiredSkills: Array.isArray(requiredSkills) ? JSON.stringify(requiredSkills) : requiredSkills,
      careerTrack
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // If requiredSkills is an array, stringify it
    if (updateData.requiredSkills && Array.isArray(updateData.requiredSkills)) {
      updateData.requiredSkills = JSON.stringify(updateData.requiredSkills);
    }

    await job.update(updateData);

    // Invalidate cache
    await redisClient.del(`job:${id}`);

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.destroy();

    // Invalidate cache
    await redisClient.del(`job:${id}`);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};
