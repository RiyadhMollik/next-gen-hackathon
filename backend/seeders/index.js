import sequelize from '../config/database.js';
import models from '../models/index.js';
import { jobsData, learningResourcesData } from './data.js';
import bcrypt from 'bcryptjs';

const { User, Job, LearningResource } = models;

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Sample users data
    const usersData = [
      {
        fullName: 'Admin User',
        email: 'admin@empowerroute.com',
        password: await bcrypt.hash('admin123', 10),
        preferredCareerTrack: 'Management',
        experienceLevel: 'Senior',
        role: 'admin'
      },
      {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        preferredCareerTrack: 'Web Development',
        experienceLevel: 'Junior',
        role: 'user'
      },
      {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        preferredCareerTrack: 'Data Science',
        experienceLevel: 'Mid',
        role: 'user'
      },
      {
        fullName: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: await bcrypt.hash('password123', 10),
        preferredCareerTrack: 'Mobile Development',
        experienceLevel: 'Fresher',
        role: 'user'
      },
      {
        fullName: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: await bcrypt.hash('password123', 10),
        preferredCareerTrack: 'UI/UX Design',
        experienceLevel: 'Junior',
        role: 'user'
      }
    ];

    // Seed users
    await User.bulkCreate(usersData);
    console.log(`✓ Seeded ${usersData.length} users`);

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
