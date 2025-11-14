import { Op } from 'sequelize';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Course from '../models/Course.js';
import Interview from '../models/Interview.js';
import UserSkill from '../models/UserSkill.js';
import LearningResource from '../models/LearningResource.js';
import sequelize from '../config/database.js';

// @desc    Get SDG 8 Impact Analytics
// @route   GET /api/analytics/sdg-impact
// @access  Admin
export const getSDGImpactAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter if provided
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // 1. Number of users analyzed (users with skills/CV uploaded)
    const usersAnalyzed = await User.count({
      where: {
        ...dateFilter,
        [Op.or]: [
          { cvText: { [Op.ne]: null } },
          { '$skills.id$': { [Op.ne]: null } }
        ]
      },
      include: [{
        model: UserSkill,
        as: 'skills',
        attributes: [],
        required: false
      }],
      distinct: true
    });

    // 2. Total users registered
    const totalUsers = await User.count({
      where: dateFilter
    });

    // 3. Jobs suggested (total job postings)
    const jobsSuggested = await Job.count({
      where: dateFilter
    });

    // 4. Skills most in demand (from job requirements)
    const skillsDemand = await sequelize.query(`
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(J.skills, CONCAT('$[', numbers.n, ']'))) as skill,
        COUNT(*) as demand_count
      FROM Jobs J
      CROSS JOIN (
        SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
        UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
      ) numbers
      WHERE JSON_LENGTH(J.skills) > numbers.n
      ${startDate && endDate ? `AND J.createdAt BETWEEN '${startDate}' AND '${endDate}'` : ''}
      GROUP BY JSON_UNQUOTE(JSON_EXTRACT(J.skills, CONCAT('$[', numbers.n, ']')))
      ORDER BY demand_count DESC
      LIMIT 20
    `, { type: sequelize.QueryTypes.SELECT });

    // 5. Common skill gaps (user skills vs job requirements)
    const userSkillsData = await UserSkill.findAll({
      attributes: [
        'skillName',
        [sequelize.fn('COUNT', sequelize.col('skillName')), 'user_count']
      ],
      group: ['skillName'],
      order: [[sequelize.fn('COUNT', sequelize.col('skillName')), 'DESC']],
      limit: 20,
      raw: true
    });

    // Calculate skill gaps
    const skillGaps = [];
    const userSkillsMap = new Map(userSkillsData.map(s => [s.skillName, s.user_count]));
    
    for (const demand of skillsDemand.slice(0, 10)) {
      const userCount = userSkillsMap.get(demand.skill) || 0;
      const gap = demand.demand_count - userCount;
      
      if (gap > 0) {
        skillGaps.push({
          skill: demand.skill,
          demandCount: demand.demand_count,
          userCount: userCount,
          gap: gap,
          gapPercentage: ((gap / demand.demand_count) * 100).toFixed(2)
        });
      }
    }

    skillGaps.sort((a, b) => b.gap - a.gap);

    // 6. Courses created
    const coursesCreated = await Course.count({
      where: dateFilter
    });

    // 7. Interviews conducted
    const interviewsConducted = await Interview.count({
      where: {
        ...dateFilter,
        status: 'completed'
      }
    });

    // 8. Learning resources available
    const learningResources = await LearningResource.count({
      where: dateFilter
    });

    // 9. User engagement metrics
    const engagementMetrics = await User.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN cvText IS NOT NULL THEN 1 END')), 'withCV'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN educationLevel IS NOT NULL THEN 1 END')), 'withEducation'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN experienceLevel IS NOT NULL THEN 1 END')), 'withExperience']
      ],
      where: dateFilter,
      raw: true
    });

    // 10. Top career tracks
    const topCareerTracks = await User.findAll({
      attributes: [
        'preferredCareerTrack',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        ...dateFilter,
        preferredCareerTrack: { [Op.ne]: null }
      },
      group: ['preferredCareerTrack'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    // 11. Experience level distribution
    const experienceLevelDist = await User.findAll({
      attributes: [
        'experienceLevel',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: dateFilter,
      group: ['experienceLevel'],
      raw: true
    });

    res.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          usersAnalyzed,
          analysisRate: totalUsers > 0 ? ((usersAnalyzed / totalUsers) * 100).toFixed(2) : '0.00',
          jobsSuggested,
          coursesCreated,
          interviewsConducted,
          learningResources
        },
        skillsDemand: skillsDemand.slice(0, 20),
        skillGaps: skillGaps.slice(0, 10),
        userSkills: userSkillsData.slice(0, 20),
        engagement: engagementMetrics[0],
        topCareerTracks,
        experienceLevelDist
      }
    });
  } catch (error) {
    console.error('Get SDG analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// @desc    Get user growth statistics
// @route   GET /api/analytics/user-growth
// @access  Admin
export const getUserGrowthStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const dailyGrowth = await sequelize.query(`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM Users
      WHERE createdAt >= :startDate
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `, {
      replacements: { startDate: daysAgo },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      growth: dailyGrowth
    });
  } catch (error) {
    console.error('Get user growth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user growth stats',
      error: error.message
    });
  }
};

// @desc    Get job posting trends
// @route   GET /api/analytics/job-trends
// @access  Admin
export const getJobTrends = async (req, res) => {
  try {
    // Jobs by type
    const jobsByType = await Job.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type'],
      raw: true
    });

    // Jobs by experience level
    const jobsByExperience = await Job.findAll({
      attributes: [
        'experienceLevel',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['experienceLevel'],
      raw: true
    });

    // Recent job postings trend
    const recentJobs = await sequelize.query(`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM Jobs
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      trends: {
        byType: jobsByType,
        byExperience: jobsByExperience,
        recentPostings: recentJobs
      }
    });
  } catch (error) {
    console.error('Get job trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job trends',
      error: error.message
    });
  }
};

// @desc    Get interview performance analytics
// @route   GET /api/analytics/interview-performance
// @access  Admin
export const getInterviewPerformance = async (req, res) => {
  try {
    const totalInterviews = await Interview.count({
      where: { status: 'completed' }
    });

    const avgScore = await Interview.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('overallScore')), 'avgScore'],
        [sequelize.fn('MAX', sequelize.col('overallScore')), 'maxScore'],
        [sequelize.fn('MIN', sequelize.col('overallScore')), 'minScore']
      ],
      where: { status: 'completed' },
      raw: true
    });

    // Score distribution
    const scoreDistribution = await sequelize.query(`
      SELECT 
        CASE 
          WHEN overallScore >= 80 THEN 'Excellent (80-100)'
          WHEN overallScore >= 60 THEN 'Good (60-79)'
          WHEN overallScore >= 40 THEN 'Average (40-59)'
          ELSE 'Needs Improvement (0-39)'
        END as scoreRange,
        COUNT(*) as count
      FROM Interviews
      WHERE status = 'completed' AND overallScore IS NOT NULL
      GROUP BY scoreRange
      ORDER BY MIN(overallScore) DESC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      performance: {
        totalInterviews,
        averageScore: parseFloat(avgScore.avgScore || 0).toFixed(2),
        maxScore: avgScore.maxScore || 0,
        minScore: avgScore.minScore || 0,
        scoreDistribution
      }
    });
  } catch (error) {
    console.error('Get interview performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview performance',
      error: error.message
    });
  }
};
