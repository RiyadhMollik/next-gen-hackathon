import sequelize from '../config/database.js';
import User from './User.js';
import Job from './Job.js';
import LearningResource from './LearningResource.js';
import UserSkill from './UserSkill.js';
import Course from './Course.js';
import Interview from './Interview.js';

// Define associations
User.hasMany(UserSkill, {
  foreignKey: 'userId',
  as: 'skills'
});

UserSkill.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Course, {
  foreignKey: 'userId',
  as: 'courses'
});

Course.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Interview, {
  foreignKey: 'userId',
  as: 'interviews'
});

Interview.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

const models = {
  User,
  Job,
  LearningResource,
  UserSkill,
  Course,
  Interview
};

export { sequelize };
export default models;
