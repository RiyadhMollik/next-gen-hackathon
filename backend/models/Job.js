import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requiredSkills: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  experienceLevel: {
    type: DataTypes.ENUM('Fresher', 'Junior', 'Mid', 'Senior'),
    defaultValue: 'Fresher'
  },
  jobType: {
    type: DataTypes.ENUM('Internship', 'Part-time', 'Full-time', 'Freelance'),
    defaultValue: 'Full-time'
  },
  type: {
    type: DataTypes.ENUM('Internship', 'Part-time', 'Full-time', 'Freelance'),
    allowNull: true
  },
  careerTrack: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (job) => {
      // Sync requiredSkills to skills and jobType to type
      job.skills = job.requiredSkills;
      job.type = job.jobType;
    },
    beforeUpdate: (job) => {
      // Keep columns in sync on update
      if (job.changed('requiredSkills')) {
        job.skills = job.requiredSkills;
      }
      if (job.changed('jobType')) {
        job.type = job.jobType;
      }
    }
  }
});

export default Job;
