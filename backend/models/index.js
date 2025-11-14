import sequelize from '../config/database.js';
import User from './User.js';
import Job from './Job.js';
import LearningResource from './LearningResource.js';
import UserSkill from './UserSkill.js';

// Define associations
User.hasMany(UserSkill, {
  foreignKey: 'userId',
  as: 'skills'
});

UserSkill.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

const models = {
  User,
  Job,
  LearningResource,
  UserSkill
};

export { sequelize };
export default models;
