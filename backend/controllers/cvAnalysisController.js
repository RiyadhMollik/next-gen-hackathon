// Import pdfjs-dist legacy build for Node.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import OpenAI from 'openai';
import models from '../models/index.js';

const { User } = models;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Analyze CV PDF and extract structured data
// @route   POST /api/cv-analysis/upload-pdf
// @access  Private
export const analyzePDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Extract text from PDF using pdfjs-dist
    const dataBuffer = req.file.buffer;
    const uint8Array = new Uint8Array(dataBuffer);
    
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
    });
    
    const pdfDocument = await loadingTask.promise;
    let extractedText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      extractedText += pageText + '\n';
    }

    // Analyze with OpenAI GPT-4o
    const analysisResult = await analyzeCVText(extractedText);

    // Update user profile with extracted data
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      fullName: analysisResult.fullName || user.fullName,
      phone: analysisResult.phone || user.phone,
      address: analysisResult.address || user.address,
      website: analysisResult.website || user.website,
      email: analysisResult.email || user.email,
      summary: analysisResult.summary || user.summary,
      educationLevel: analysisResult.educationLevel || user.educationLevel,
      department: analysisResult.department || user.department,
      experienceLevel: analysisResult.experienceLevel || user.experienceLevel,
      preferredCareerTrack: analysisResult.preferredCareerTrack || user.preferredCareerTrack,
      targetRoles: analysisResult.targetRoles || user.targetRoles,
      cvText: analysisResult.cvText || user.cvText,
      projectDescriptions: analysisResult.projectDescriptions || user.projectDescriptions,
      workExperience: analysisResult.workExperience || user.workExperience,
      projects: analysisResult.projects || user.projects,
      education: analysisResult.education || user.education
    });

    // Fetch updated user
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'CV analyzed and profile updated successfully',
      profile: updatedUser,
      extractedText
    });
  } catch (error) {
    console.error('PDF Analysis Error:', error);
    next(error);
  }
};

// @desc    Analyze CV text and extract structured data
// @route   POST /api/cv-analysis/analyze-text
// @access  Private
export const analyzeText = async (req, res, next) => {
  try {
    const { cvText } = req.body;

    if (!cvText || cvText.trim() === '') {
      return res.status(400).json({ message: 'CV text is required' });
    }

    // Analyze with OpenAI GPT-4o
    const analysisResult = await analyzeCVText(cvText);

    // Update user profile with extracted data
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      fullName: analysisResult.fullName || user.fullName,
      phone: analysisResult.phone || user.phone,
      address: analysisResult.address || user.address,
      website: analysisResult.website || user.website,
      email: analysisResult.email || user.email,
      summary: analysisResult.summary || user.summary,
      educationLevel: analysisResult.educationLevel || user.educationLevel,
      department: analysisResult.department || user.department,
      experienceLevel: analysisResult.experienceLevel || user.experienceLevel,
      preferredCareerTrack: analysisResult.preferredCareerTrack || user.preferredCareerTrack,
      targetRoles: analysisResult.targetRoles || user.targetRoles,
      cvText: cvText,
      projectDescriptions: analysisResult.projectDescriptions || user.projectDescriptions,
      workExperience: analysisResult.workExperience || user.workExperience,
      projects: analysisResult.projects || user.projects,
      education: analysisResult.education || user.education
    });

    // Fetch updated user
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'CV text analyzed and profile updated successfully',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Text Analysis Error:', error);
    next(error);
  }
};

// Helper function to analyze CV text with OpenAI
async function analyzeCVText(cvText) {
  const prompt = `You are an expert CV/Resume parser. Analyze the following CV text and extract structured information in JSON format.

Extract the following fields:
1. fullName - The person's full name
2. email - Email address
3. phone - Phone number (with country code if available)
4. address - Physical address or location
5. website - Personal website, portfolio, or LinkedIn URL
6. summary - Professional summary or objective (2-4 sentences)
7. educationLevel - Highest education level (e.g., "BSC", "MSC", "PhD", "Diploma")
8. department - Field of study or department (e.g., "CSE", "EEE", "Business")
9. experienceLevel - Work experience level: "Fresher", "Junior", "Mid", or "Senior"
10. preferredCareerTrack - Career interests (e.g., "Web development, Data science")
11. targetRoles - Desired job roles (e.g., "Backend Developer, Frontend Developer")
12. cvText - Full CV text summary
13. projectDescriptions - Brief summary of all projects mentioned
14. workExperience - Array of work experiences in format: [{"position": "Title", "company": "Company Name", "period": "Start - End", "responsibilities": ["bullet point 1", "bullet point 2"]}]
15. projects - Array of projects in format: [{"name": "Project Name", "period": "Year or Duration", "description": "Brief description", "achievements": ["achievement 1", "achievement 2"]}]
16. education - Array of education in format: [{"degree": "Degree Name", "school": "Institution Name", "period": "Start - End"}]

Rules:
- If a field is not found in the CV, return null for that field
- For arrays (workExperience, projects, education), return empty array [] if nothing found
- Keep responsibilities and achievements concise (1-2 sentences each)
- Infer experienceLevel based on years of experience: 0-1 years = "Fresher", 1-3 = "Junior", 3-7 = "Mid", 7+ = "Senior"
- Extract skills mentioned but don't include in response (handled separately)

CV Text:
${cvText}

Return ONLY valid JSON with the structure above. No additional text or explanation.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a precise CV parser that returns only valid JSON. Never include explanatory text outside the JSON structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    // Convert arrays to JSON strings for database storage
    if (result.workExperience && Array.isArray(result.workExperience)) {
      result.workExperience = JSON.stringify(result.workExperience);
    }
    if (result.projects && Array.isArray(result.projects)) {
      result.projects = JSON.stringify(result.projects);
    }
    if (result.education && Array.isArray(result.education)) {
      result.education = JSON.stringify(result.education);
    }

    return result;
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to analyze CV with AI');
  }
}
