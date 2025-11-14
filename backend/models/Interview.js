import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Interview = sequelize.define('Interview', {
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
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userSkills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of {question, expectedAnswer, category}'
  },
  userAnswers: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of {questionIndex, answer, timestamp}'
  },
  feedback: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'AI-generated feedback for each answer'
  },
  overallScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Overall performance score out of 100'
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Interview duration in seconds'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  integrityReport: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Interview integrity monitoring report with fraud detection data'
  },
  behaviorReport: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Behavioral analysis report with AI-generated insights'
  }
}, {
  tableName: 'interviews',
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

export default Interview;
