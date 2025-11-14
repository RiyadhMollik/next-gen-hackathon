import sequelize from '../config/database.js';
import models from '../models/index.js';
import { jobsData, learningResourcesData } from './data.js';

const { Job, LearningResource } = models;

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    // Seed jobs
    await Job.bulkCreate(jobsData);
    console.log(`✓ Seeded ${jobsData.length} jobs`);

    // Seed learning resources
    await LearningResource.bulkCreate(learningResourcesData);
    console.log(`✓ Seeded ${learningResourcesData.length} learning resources`);

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
