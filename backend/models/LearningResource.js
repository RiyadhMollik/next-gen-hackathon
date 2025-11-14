import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LearningResource = sequelize.define('LearningResource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  relatedSkills: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  cost: {
    type: DataTypes.ENUM('Free', 'Paid'),
    defaultValue: 'Free'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner'
  }
}, {
  timestamps: true
});

export default LearningResource;
