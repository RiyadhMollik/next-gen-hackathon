import models from '../models/index.js';

const { User, UserSkill } = models;

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: UserSkill,
        as: 'skills'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ profile: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      educationLevel,
      department,
      experienceLevel,
      preferredCareerTrack,
      cvText,
      projectDescriptions,
      targetRoles,
      phone,
      address,
      website,
      summary,
      workExperience,
      projects,
      education
    } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    await user.update({
      fullName: fullName || user.fullName,
      educationLevel: educationLevel || user.educationLevel,
      department: department || user.department,
      experienceLevel: experienceLevel || user.experienceLevel,
      preferredCareerTrack: preferredCareerTrack || user.preferredCareerTrack,
      cvText: cvText !== undefined ? cvText : user.cvText,
      projectDescriptions: projectDescriptions !== undefined ? projectDescriptions : user.projectDescriptions,
      targetRoles: targetRoles || user.targetRoles,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address,
      website: website !== undefined ? website : user.website,
      summary: summary !== undefined ? summary : user.summary,
      workExperience: workExperience !== undefined ? workExperience : user.workExperience,
      projects: projects !== undefined ? projects : user.projects,
      education: education !== undefined ? education : user.education
    });

    // Fetch updated user with skills
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: UserSkill,
        as: 'skills'
      }]
    });

    res.json({
      message: 'Profile updated successfully',
      profile: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a skill
// @route   POST /api/profile/skills
// @access  Private
export const addSkill = async (req, res, next) => {
  try {
    const { skillName, proficiency } = req.body;

    if (!skillName) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    // Check if skill already exists for user
    const existingSkill = await UserSkill.findOne({
      where: { userId: req.userId, skillName }
    });

    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    const skill = await UserSkill.create({
      userId: req.userId,
      skillName,
      proficiency: proficiency || 'Beginner'
    });

    res.status(201).json({
      message: 'Skill added successfully',
      skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/profile/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const skill = await UserSkill.findOne({
      where: { id, userId: req.userId }
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await skill.destroy();

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};
