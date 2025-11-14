import sequelize from './config/database.js';

async function addFraudDetectionColumns() {
  try {
    console.log('🔧 Adding fraud detection columns to interviews table...');
    
    await sequelize.query(`
      ALTER TABLE interviews 
      ADD COLUMN IF NOT EXISTS integrityReport JSON NULL DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS behaviorReport JSON NULL DEFAULT NULL
    `);
    
    console.log('✅ Successfully added fraud detection columns!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
    process.exit(1);
  }
}

addFraudDetectionColumns();
