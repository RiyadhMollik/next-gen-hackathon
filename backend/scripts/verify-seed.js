import sequelize from '../config/database.js';
import models from '../models/index.js';

const { User, Job, LearningResource } = models;

const verifySeed = async () => {
  try {
    console.log('🔍 Verifying seeded data...\n');

    // Count users
    const userCount = await User.count();
    console.log(`👥 Users: ${userCount}`);

    // Count jobs
    const jobCount = await Job.count();
    console.log(`💼 Jobs: ${jobCount}`);

    // Count learning resources
    const resourceCount = await LearningResource.count();
    console.log(`📚 Learning Resources: ${resourceCount}`);

    // Show sample data
    console.log('\n📋 Sample Users:');
    const sampleUsers = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'preferredCareerTrack'],
      limit: 3
    });
    console.table(sampleUsers.map(user => user.toJSON()));

    console.log('\n💼 Sample Jobs:');
    const sampleJobs = await Job.findAll({
      attributes: ['id', 'title', 'company', 'location', 'experienceLevel'],
      limit: 3
    });
    console.table(sampleJobs.map(job => job.toJSON()));

    console.log('\n✅ Verification completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification error:', error);
    process.exit(1);
  }
};

verifySeed();
