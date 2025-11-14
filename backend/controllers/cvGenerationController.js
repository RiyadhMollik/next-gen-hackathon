import User from '../models/User.js';
import UserSkill from '../models/UserSkill.js';
import axios from 'axios';

// AI-Powered CV Generation with Professional Formatting
export const generateAICV = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile with skills
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skills = await UserSkill.findAll({
      where: { userId },
      attributes: ['skillName', 'proficiency']
    });

    // Parse JSON fields
    const parseJSON = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string' && field.trim() !== '') {
        try {
          let parsed = JSON.parse(field);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    };

    const workExperience = parseJSON(user.workExperience);
    const projects = parseJSON(user.projects);
    const education = parseJSON(user.education);

    // Generate AI-enhanced content
    const aiEnhancements = await generateAIEnhancements(user, skills, workExperience, projects);

    // Prepare CV data with AI suggestions
    const cvData = {
      personalInfo: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        website: user.website,
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || ''
      },
      professionalSummary: {
        original: user.summary || user.cvText || '',
        aiSuggestion: aiEnhancements.professionalSummary,
        recommendation: 'AI-enhanced summary highlighting key achievements and career goals'
      },
      workExperience: workExperience.map((exp, index) => ({
        ...exp,
        enhancedBulletPoints: aiEnhancements.workExperienceBullets[index] || exp.responsibilities,
        recommendations: aiEnhancements.workExperienceRecommendations[index] || []
      })),
      projects: projects.map((proj, index) => ({
        ...proj,
        enhancedBulletPoints: aiEnhancements.projectBullets[index] || proj.achievements,
        recommendations: aiEnhancements.projectRecommendations[index] || []
      })),
      education: education,
      skills: skills.map(s => ({ name: s.skillName, level: s.proficiency })),
      aiRecommendations: {
        linkedinProfile: aiEnhancements.linkedinRecommendations,
        portfolioImprovements: aiEnhancements.portfolioRecommendations,
        overallTips: aiEnhancements.overallTips
      }
    };

    res.json({
      success: true,
      cvData,
      message: 'AI-enhanced CV generated successfully'
    });
  } catch (error) {
    console.error('Error generating AI CV:', error);
    res.status(500).json({ message: 'Error generating CV', error: error.message });
  }
};

// Generate AI Enhancements using Career Bot API
async function generateAIEnhancements(user, skills, workExperience, projects) {
  try {
    const CAREER_BOT_URL = process.env.CAREER_BOT_URL || 'http://localhost:8000';
    
    // Prepare context for AI
    const userContext = {
      name: user.fullName,
      experienceLevel: user.experienceLevel,
      careerTrack: user.preferredCareerTrack,
      educationLevel: user.educationLevel,
      department: user.department,
      skills: skills.map(s => s.skillName),
      currentSummary: user.summary || user.cvText || '',
      workExperience,
      projects
    };

    // Generate Professional Summary
    const summaryPrompt = `Based on this profile, create a compelling professional summary (3-4 sentences):
- Name: ${userContext.name}
- Experience Level: ${userContext.experienceLevel}
- Career Track: ${userContext.careerTrack}
- Education: ${userContext.educationLevel} in ${userContext.department}
- Key Skills: ${userContext.skills.join(', ')}
- Current Summary: ${userContext.currentSummary}

Generate a professional, achievement-focused summary that highlights unique value proposition.`;

    const summaryResponse = await axios.post(`${CAREER_BOT_URL}/chat`, {
      message: summaryPrompt,
      user_profile: userContext
    }, { timeout: 15000 });

    const professionalSummary = summaryResponse.data.response || userContext.currentSummary;

    // Enhance Work Experience Bullets
    const workExperienceBullets = [];
    const workExperienceRecommendations = [];

    for (let i = 0; i < Math.min(workExperience.length, 3); i++) {
      const exp = workExperience[i];
      const bulletPrompt = `Rewrite these work responsibilities as strong, achievement-focused bullet points using action verbs and quantifiable results:
Position: ${exp.position} at ${exp.company}
Current bullets:
${exp.responsibilities.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}

Provide 3-5 improved bullet points following STAR method (Situation, Task, Action, Result).`;

      try {
        const bulletResponse = await axios.post(`${CAREER_BOT_URL}/chat`, {
          message: bulletPrompt,
          user_profile: userContext
        }, { timeout: 15000 });

        const enhanced = parseBulletPoints(bulletResponse.data.response);
        workExperienceBullets.push(enhanced.length > 0 ? enhanced : exp.responsibilities);
        workExperienceRecommendations.push([
          'Use action verbs (Led, Developed, Implemented)',
          'Quantify achievements with metrics',
          'Focus on impact and results'
        ]);
      } catch (error) {
        workExperienceBullets.push(exp.responsibilities);
        workExperienceRecommendations.push([]);
      }
    }

    // Enhance Project Achievements
    const projectBullets = [];
    const projectRecommendations = [];

    for (let i = 0; i < Math.min(projects.length, 3); i++) {
      const proj = projects[i];
      const projectPrompt = `Rewrite these project achievements as impactful bullet points:
Project: ${proj.name}
Description: ${proj.description || ''}
Current achievements:
${proj.achievements.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}

Provide 3-4 strong bullet points highlighting technologies used, challenges solved, and measurable impact.`;

      try {
        const projectResponse = await axios.post(`${CAREER_BOT_URL}/chat`, {
          message: projectPrompt,
          user_profile: userContext
        }, { timeout: 15000 });

        const enhanced = parseBulletPoints(projectResponse.data.response);
        projectBullets.push(enhanced.length > 0 ? enhanced : proj.achievements);
        projectRecommendations.push([
          'Highlight technical skills and tools used',
          'Emphasize problem-solving approach',
          'Include project outcomes or metrics'
        ]);
      } catch (error) {
        projectBullets.push(proj.achievements);
        projectRecommendations.push([]);
      }
    }

    // LinkedIn Profile Recommendations
    const linkedinPrompt = `Provide 5 specific recommendations to improve a LinkedIn profile for a ${userContext.experienceLevel} ${userContext.careerTrack} professional with these skills: ${userContext.skills.join(', ')}`;
    
    let linkedinRecommendations = [
      'Add a professional headshot and banner',
      'Write a compelling headline with keywords',
      'Request recommendations from colleagues',
      'Share industry insights regularly',
      'Join relevant professional groups'
    ];

    try {
      const linkedinResponse = await axios.post(`${CAREER_BOT_URL}/chat`, {
        message: linkedinPrompt,
        user_profile: userContext
      }, { timeout: 10000 });
      linkedinRecommendations = parseBulletPoints(linkedinResponse.data.response) || linkedinRecommendations;
    } catch (error) {
      // Use default recommendations
    }

    // Portfolio Recommendations
    const portfolioRecommendations = [
      'Create a clean, responsive portfolio website',
      'Showcase 3-5 best projects with case studies',
      'Include live demos and GitHub links',
      'Add a blog section for technical writing',
      'Ensure mobile-friendly design',
      'Add contact form and social links'
    ];

    // Overall Tips
    const overallTips = [
      'Tailor your CV for each job application',
      'Use keywords from job descriptions',
      'Keep CV to 1-2 pages maximum',
      'Proofread for grammar and spelling',
      'Use consistent formatting throughout',
      'Include relevant certifications and courses'
    ];

    return {
      professionalSummary,
      workExperienceBullets,
      workExperienceRecommendations,
      projectBullets,
      projectRecommendations,
      linkedinRecommendations,
      portfolioRecommendations,
      overallTips
    };
  } catch (error) {
    console.error('Error generating AI enhancements:', error.message);
    // Return basic enhancements if AI fails
    return {
      professionalSummary: user.summary || user.cvText || 'Motivated professional seeking opportunities in technology.',
      workExperienceBullets: workExperience.map(exp => exp.responsibilities),
      workExperienceRecommendations: workExperience.map(() => []),
      projectBullets: projects.map(proj => proj.achievements),
      projectRecommendations: projects.map(() => []),
      linkedinRecommendations: ['Update profile regularly', 'Network actively', 'Share content'],
      portfolioRecommendations: ['Build portfolio website', 'Showcase projects', 'Keep updated'],
      overallTips: ['Keep CV concise', 'Use action verbs', 'Highlight achievements']
    };
  }
}

// Helper to parse bullet points from AI response
function parseBulletPoints(text) {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const bullets = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines starting with numbers, bullets, or dashes
    if (/^[\d•\-\*]/.test(trimmed)) {
      const cleaned = trimmed.replace(/^[\d•\-\*\.)\s]+/, '').trim();
      if (cleaned.length > 10) {
        bullets.push(cleaned);
      }
    }
  }
  
  return bullets.length > 0 ? bullets : [text];
}

// Save AI-enhanced profile updates
export const saveAIEnhancements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { professionalSummary, workExperience, projects } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile with AI-enhanced content
    if (professionalSummary) {
      user.summary = professionalSummary;
    }

    if (workExperience && Array.isArray(workExperience)) {
      user.workExperience = JSON.stringify(workExperience);
    }

    if (projects && Array.isArray(projects)) {
      user.projects = JSON.stringify(projects);
    }

    await user.save();

    res.json({
      success: true,
      message: 'AI enhancements saved successfully',
      profile: user
    });
  } catch (error) {
    console.error('Error saving AI enhancements:', error);
    res.status(500).json({ message: 'Error saving enhancements', error: error.message });
  }
};
