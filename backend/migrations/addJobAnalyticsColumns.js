import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const addJobAnalyticsColumns = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db'
  });

  try {
    console.log('Adding analytics-friendly columns to Jobs table...');
    
    // Add 'type' column as alias/copy of 'jobType'
    try {
      await connection.query(`
        ALTER TABLE Jobs 
        ADD COLUMN type ENUM('Internship', 'Part-time', 'Full-time', 'Freelance') 
        AFTER jobType
      `);
      console.log('✓ Type column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Type column already exists');
      } else {
        throw error;
      }
    }

    // Add 'skills' column as alias/copy of 'requiredSkills'
    try {
      await connection.query(`
        ALTER TABLE Jobs 
        ADD COLUMN skills JSON 
        AFTER requiredSkills
      `);
      console.log('✓ Skills column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Skills column already exists');
      } else {
        throw error;
      }
    }

    // Copy existing data from jobType to type
    await connection.query(`
      UPDATE Jobs 
      SET type = jobType 
      WHERE type IS NULL
    `);
    console.log('✓ Copied jobType data to type column');

    // Copy existing data from requiredSkills to skills
    await connection.query(`
      UPDATE Jobs 
      SET skills = requiredSkills 
      WHERE skills IS NULL
    `);
    console.log('✓ Copied requiredSkills data to skills column');

    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

addJobAnalyticsColumns();
