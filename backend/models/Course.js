import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  noOfChapters: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  includeVideo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  courseLayout: {
    type: DataTypes.JSON,
    allowNull: true
  },
  courseContent: {
    type: DataTypes.JSON,
    allowNull: true
  },
  bannerImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'generating', 'published', 'archived'),
    defaultValue: 'draft'
  },
  completedChapters: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true
});

export default Course;
