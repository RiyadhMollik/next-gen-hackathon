import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Roadmap = sequelize.define('Roadmap', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  targetRole: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currentSkills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  timeframe: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., 3 months, 6 months'
  },
  weeklyHours: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Hours available per week for learning'
  },
  roadmapData: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Contains phases, topics, projects, and timeline'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'archived'),
    defaultValue: 'active'
  },
  progress: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Track user progress through roadmap phases'
  }
}, {
  tableName: 'roadmaps',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    }
  ]
});

export default Roadmap;
