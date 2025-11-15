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

// @desc    Get opportunities for disadvantaged groups
// @route   GET /api/admin/opportunities/disadvantaged-groups
// @access  Admin
export const getDisadvantagedGroupsOpportunities = async (req, res) => {
  try {
    // Get users from disadvantaged groups
    const disadvantagedUsers = await User.findAll({
      where: {
        [Op.or]: [
          { educationLevel: { [Op.in]: ['High School', 'Some College'] } },
          { experienceLevel: 'Fresher' }
        ]
      },
      attributes: ['id', 'fullName', 'email', 'educationLevel', 'experienceLevel', 'preferredCareerTrack', 'createdAt']
    });

    // Get entry-level and internship opportunities
    const targetedJobs = await Job.findAll({
      where: {
        [Op.or]: [
          { experienceLevel: { [Op.in]: ['Fresher', 'Internship'] } },
          { jobType: { [Op.in]: ['Internship', 'Part-time'] } }
        ],
        isActive: true
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Categorize opportunities by target group
    const opportunities = {
      freshGraduates: targetedJobs.filter(j => j.experienceLevel === 'Fresher'),
      internships: targetedJobs.filter(j => j.jobType === 'Internship'),
      partTime: targetedJobs.filter(j => j.jobType === 'Part-time'),
      remote: targetedJobs.filter(j => j.location.toLowerCase().includes('remote'))
    };

    // Get matching statistics
    const matchingStats = {
      totalDisadvantagedUsers: disadvantagedUsers.length,
      totalTargetedJobs: targetedJobs.length,
      byCategory: {
        freshGraduates: opportunities.freshGraduates.length,
        internships: opportunities.internships.length,
        partTime: opportunities.partTime.length,
        remote: opportunities.remote.length
      },
      byCareerTrack: {}
    };

    // Count by career track
    disadvantagedUsers.forEach(user => {
      const track = user.preferredCareerTrack || 'Unspecified';
      matchingStats.byCareerTrack[track] = (matchingStats.byCareerTrack[track] || 0) + 1;
    });

    res.json({
      success: true,
      disadvantagedUsers: disadvantagedUsers.slice(0, 20), // Limit for display
      opportunities,
      stats: matchingStats,
      recommendations: {
        createMoreInternships: opportunities.internships.length < disadvantagedUsers.length * 0.3,
        createMoreRemoteJobs: opportunities.remote.length < disadvantagedUsers.length * 0.4,
        focusOnFreshers: disadvantagedUsers.filter(u => u.experienceLevel === 'Fresher').length > disadvantagedUsers.length * 0.5
      }
    });
  } catch (error) {
    console.error('Get disadvantaged groups opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disadvantaged groups opportunities',
      error: error.message
    });
  }
};

// @desc    Get regional opportunities
// @route   GET /api/admin/opportunities/regional
// @access  Admin
export const getRegionalOpportunities = async (req, res) => {
  try {
    // Get all jobs and categorize by region
    const allJobs = await Job.findAll({
      where: { isActive: true },
      attributes: ['id', 'title', 'company', 'location', 'jobType', 'experienceLevel', 'careerTrack', 'salary', 'createdAt']
    });

    // Categorize by location
    const regionalData = {};
    const bangladeshCities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
    
    allJobs.forEach(job => {
      const location = job.location;
      
      // Check if it's a Bangladesh city
      const cityMatch = bangladeshCities.find(city => location.includes(city));
      const region = cityMatch ? `Bangladesh - ${cityMatch}` : 
                     location.toLowerCase().includes('remote') ? 'Remote' :
                     location.includes('Bangladesh') ? 'Bangladesh - Other' : 'International';
      
      if (!regionalData[region]) {
        regionalData[region] = {
          jobs: [],
          count: 0,
          byType: {},
          byExperience: {},
          avgSalary: []
        };
      }
      
      regionalData[region].jobs.push(job);
      regionalData[region].count++;
      
      // Count by type
      regionalData[region].byType[job.jobType] = (regionalData[region].byType[job.jobType] || 0) + 1;
      
      // Count by experience
      regionalData[region].byExperience[job.experienceLevel] = (regionalData[region].byExperience[job.experienceLevel] || 0) + 1;
      
      // Track salary if available
      if (job.salary) {
        regionalData[region].avgSalary.push(job.salary);
      }
    });

    // Get users by region
    const allUsers = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'preferredCareerTrack', 'experienceLevel']
    });

    // Regional statistics
    const regionalStats = Object.keys(regionalData).map(region => ({
      region,
      totalJobs: regionalData[region].count,
      jobTypes: regionalData[region].byType,
      experienceLevels: regionalData[region].byExperience,
      topJobs: regionalData[region].jobs.slice(0, 5),
      opportunityIndex: regionalData[region].count / Math.max(allUsers.length, 1) * 100 // Jobs per 100 users
    }));

    // Sort by total jobs
    regionalStats.sort((a, b) => b.totalJobs - a.totalJobs);

    res.json({
      success: true,
      regionalData: regionalStats,
      summary: {
        totalRegions: regionalStats.length,
        totalJobs: allJobs.length,
        remoteJobs: regionalData['Remote']?.count || 0,
        bangladeshJobs: allJobs.filter(j => j.location.includes('Bangladesh')).length,
        internationalJobs: allJobs.filter(j => !j.location.includes('Bangladesh') && !j.location.toLowerCase().includes('remote')).length
      },
      recommendations: {
        expandRemoteOpportunities: (regionalData['Remote']?.count || 0) < allJobs.length * 0.4,
        focusOnBangladesh: regionalData['Bangladesh - Dhaka']?.count > allJobs.length * 0.5,
        diversifyLocations: regionalStats.length < 5
      }
    });
  } catch (error) {
    console.error('Get regional opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regional opportunities',
      error: error.message
    });
  }
};

// @desc    Update job to target disadvantaged groups
// @route   PUT /api/admin/jobs/:jobId/disadvantaged-groups
// @access  Admin
export const updateJobForDisadvantagedGroups = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { targetGroups, specialAccommodations, description } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Update job to highlight it for disadvantaged groups
    const updates = {
      description: description || job.description + '\n\n🌟 This opportunity welcomes applications from disadvantaged groups and provides equal opportunities for all.',
      // You can add custom fields to Job model if needed
    };

    await job.update(updates);

    res.json({
      success: true,
      message: 'Job updated successfully for disadvantaged groups targeting',
      job
    });
  } catch (error) {
    console.error('Update job for disadvantaged groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// @desc    Get SDG impact report
// @route   GET /api/admin/sdg-impact-report
// @access  Admin
export const getSDGImpactReport = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { isActive: true } });
    
    // Disadvantaged groups impact
    const disadvantagedUsers = await User.count({
      where: {
        [Op.or]: [
          { educationLevel: { [Op.in]: ['High School', 'Some College'] } },
          { experienceLevel: 'Fresher' }
        ]
      }
    });

    const entryLevelJobs = await Job.count({
      where: {
        experienceLevel: { [Op.in]: ['Fresher', 'Internship'] },
        isActive: true
      }
    });

    // Regional impact
    const remoteJobs = await Job.count({
      where: {
        location: { [Op.like]: '%Remote%' },
        isActive: true
      }
    });

    const bangladeshJobs = await Job.count({
      where: {
        location: { [Op.like]: '%Bangladesh%' },
        isActive: true
      }
    });

    // Skills development
    const totalCourses = await Course.count();
    // Count courses where all chapters are completed
    // Since Course model uses completedChapters JSON array, we need to use raw query
    const allCourses = await Course.findAll({
      attributes: ['id', 'noOfChapters', 'completedChapters']
    });
    const completedCourses = allCourses.filter(course => {
      if (!course.completedChapters || !Array.isArray(course.completedChapters)) return false;
      return course.completedChapters.length >= course.noOfChapters;
    }).length;

    // Interview practice
    const totalInterviews = await Interview.count();
    const completedInterviews = await Interview.count({
      where: { status: 'completed' }
    });

    // Calculate impact metrics
    const report = {
      overallImpact: {
        totalUsers,
        totalJobs,
        activeJobs,
        jobsPerUser: (activeJobs / Math.max(totalUsers, 1)).toFixed(2)
      },
      disadvantagedGroupsImpact: {
        totalDisadvantagedUsers: disadvantagedUsers,
        percentageOfTotal: ((disadvantagedUsers / Math.max(totalUsers, 1)) * 100).toFixed(1),
        targetedOpportunities: entryLevelJobs,
        opportunityCoverage: ((entryLevelJobs / Math.max(disadvantagedUsers, 1)) * 100).toFixed(1)
      },
      regionalImpact: {
        remoteJobs,
        bangladeshJobs,
        internationalJobs: activeJobs - bangladeshJobs - remoteJobs,
        remotePercentage: ((remoteJobs / Math.max(activeJobs, 1)) * 100).toFixed(1),
        localPercentage: ((bangladeshJobs / Math.max(activeJobs, 1)) * 100).toFixed(1)
      },
      skillsDevelopment: {
        totalCourses,
        completedCourses,
        completionRate: ((completedCourses / Math.max(totalCourses, 1)) * 100).toFixed(1)
      },
      interviewPreparation: {
        totalInterviews,
        completedInterviews,
        completionRate: ((completedInterviews / Math.max(totalInterviews, 1)) * 100).toFixed(1)
      },
      sdgAlignment: {
        decentWorkOpportunities: activeJobs,
        inclusiveEmployment: entryLevelJobs + remoteJobs,
        skillsTraining: totalCourses,
        youthEmpowerment: disadvantagedUsers
      }
    };

    res.json({
      success: true,
      report,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Get SDG impact report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate SDG impact report',
      error: error.message
    });
  }
};
