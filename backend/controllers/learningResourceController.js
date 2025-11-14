import models from '../models/index.js';
import { Op } from 'sequelize';
import redisClient from '../config/redis.js';

const { LearningResource } = models;

// @desc    Get all learning resources with filtering
// @route   GET /api/learning-resources
// @access  Private
export const getAllResources = async (req, res, next) => {
  try {
    const { search, platform, level, cost, page = 1, limit = 20 } = req.query;

    // Build where clause
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { platform: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (platform) {
      where.platform = platform;
    }

    if (level) {
      where.level = level;
    }

    if (cost) {
      where.cost = cost;
    }

    const offset = (page - 1) * limit;

    const { count, rows: resources } = await LearningResource.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      resources,
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

// @desc    Get single resource by ID
// @route   GET /api/learning-resources/:id
// @access  Private
export const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try to get from cache first
    const cacheKey = `resource:${id}`;
    const cachedResource = await redisClient.get(cacheKey);

    if (cachedResource) {
      return res.json({ resource: JSON.parse(cachedResource), cached: true });
    }

    const resource = await LearningResource.findByPk(id);

    if (!resource) {
      return res.status(404).json({ message: 'Learning resource not found' });
    }

    // Cache for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(resource), { EX: 3600 });

    res.json({ resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new learning resource
// @route   POST /api/learning-resources
// @access  Private
export const createResource = async (req, res, next) => {
  try {
    const {
      title,
      platform,
      url,
      description,
      relatedSkills,
      level,
      duration,
      cost
    } = req.body;

    const resource = await LearningResource.create({
      title,
      platform,
      url,
      description,
      relatedSkills: Array.isArray(relatedSkills) ? JSON.stringify(relatedSkills) : relatedSkills,
      level,
      duration,
      cost
    });

    res.status(201).json({
      message: 'Learning resource created successfully',
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a learning resource
// @route   PUT /api/learning-resources/:id
// @access  Private
export const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const resource = await LearningResource.findByPk(id);

    if (!resource) {
      return res.status(404).json({ message: 'Learning resource not found' });
    }

    // If relatedSkills is an array, stringify it
    if (updateData.relatedSkills && Array.isArray(updateData.relatedSkills)) {
      updateData.relatedSkills = JSON.stringify(updateData.relatedSkills);
    }

    await resource.update(updateData);

    // Invalidate cache
    await redisClient.del(`resource:${id}`);

    res.json({
      message: 'Learning resource updated successfully',
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a learning resource
// @route   DELETE /api/learning-resources/:id
// @access  Private
export const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resource = await LearningResource.findByPk(id);

    if (!resource) {
      return res.status(404).json({ message: 'Learning resource not found' });
    }

    await resource.destroy();

    // Invalidate cache
    await redisClient.del(`resource:${id}`);

    res.json({ message: 'Learning resource deleted successfully' });
  } catch (error) {
    next(error);
  }
};
