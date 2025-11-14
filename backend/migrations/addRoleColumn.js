import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addRoleColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db'
  });

  try {
    console.log('Adding role column to Users table...');
    await connection.execute(
      'ALTER TABLE Users ADD COLUMN role ENUM("user", "admin") DEFAULT "user"'
    );
    console.log('✓ Role column added successfully');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Role column already exists');
    } else {
      console.error('Error adding role column:', error.message);
      throw error;
    }
  }

  try {
    console.log('Setting first user as admin...');
    const [result] = await connection.execute(
      'UPDATE Users SET role = "admin" WHERE id = 1'
    );
    console.log('✓ User ID 1 set as admin');
  } catch (error) {
    console.error('Error setting admin:', error.message);
  }

  await connection.end();
  console.log('\n✅ Migration complete!');
}

addRoleColumn().catch(console.error);
