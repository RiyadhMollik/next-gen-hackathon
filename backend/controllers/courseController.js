import OpenAI from 'openai';
import axios from 'axios';
import User from '../models/User.js';
import Course from '../models/Course.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const COURSE_LAYOUT_PROMPT = `Generate a comprehensive learning course based on the following details. Create a detailed JSON structure with:
- Course Name
- Description
- Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing the topic. Include educational elements such as books, screens, icons, and learning tools. Use a vibrant color palette with a clean, professional look.)
- Chapter Names
- Topics under each chapter
- Duration for each chapter

Return ONLY valid JSON in this exact schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"]
      }
    ]
  }
}

User Input: `;

const CHAPTER_CONTENT_PROMPT = `Based on the Chapter name and Topics, generate detailed HTML content for each topic.
Provide comprehensive educational content with examples, explanations, and key points.

Return ONLY valid JSON in this schema:
{
  "chapterName": "string",
  "topics": [
    {
      "topicName": "string",
      "content": "HTML formatted string with <h3>, <p>, <ul>, <li>, <strong>, etc."
    }
  ]
}

User Input: `;

// @desc    Generate course layout using OpenAI GPT-4o
// @route   POST /api/courses/generate-layout
// @access  Private
export const generateCourseLayout = async (req, res) => {
  try {
    const { name, description, noOfChapters, includeVideo, level, category } = req.body;

    // Validation
    if (!name || !description || !level || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const formData = {
      name,
      description,
      noOfChapters: noOfChapters || 5,
      includeVideo: includeVideo || false,
      level,
      category
    };

    // Generate course layout with OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert course curriculum designer. Generate comprehensive course structures in valid JSON format only.'
        },
        {
          role: 'user',
          content: COURSE_LAYOUT_PROMPT + JSON.stringify(formData)
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0].message.content;

    // Parse JSON response
    const courseJson = JSON.parse(text);

    // Generate banner image
    const bannerImageUrl = await generateBannerImage(courseJson.course.bannerImagePrompt);

    // Create course in database
    const course = await Course.create({
      userId: req.userId,
      name: formData.name,
      description: formData.description,
      noOfChapters: formData.noOfChapters,
      includeVideo: formData.includeVideo,
      level: formData.level,
      category: formData.category,
      courseLayout: courseJson,
      bannerImageUrl: bannerImageUrl,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      courseId: course.id,
      courseLayout: courseJson,
      bannerImageUrl
    });
  } catch (error) {
    console.error('Course layout generation error:', error);
    res.status(500).json({
      message: 'Failed to generate course layout',
      error: error.message
    });
  }
};

// @desc    Generate course content for all chapters
// @route   POST /api/courses/generate-content/:courseId
// @access  Private
export const generateCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, userId: req.userId }
    });

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    let courseLayout = course.courseLayout;

    // Parse JSON if it's a string
    if (typeof courseLayout === 'string') {
      try {
        courseLayout = JSON.parse(courseLayout);
      } catch (e) {
        console.error('Failed to parse courseLayout:', e);
      }
    }

    console.log('Course Layout:', JSON.stringify(courseLayout, null, 2));

    // Handle both nested {course: {chapters: []}} and flat {chapters: []} structures
    const layoutData = courseLayout?.course || courseLayout;

    if (!layoutData || !layoutData.chapters) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course layout: Missing course data or chapters',
        debug: { 
          hasLayout: !!courseLayout, 
          hasCourse: !!courseLayout?.course,
          hasChapters: !!layoutData?.chapters,
          structure: Object.keys(courseLayout || {})
        }
      });
    }

    if (!Array.isArray(layoutData.chapters) || layoutData.chapters.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course layout: Missing or empty chapters array',
        debug: { 
          hasChapters: !!layoutData.chapters,
          isArray: Array.isArray(layoutData.chapters),
          length: layoutData.chapters?.length || 0
        }
      });
    }

    console.log(`Generating content for ${layoutData.chapters.length} chapters...`);

    // Generate content for each chapter using OpenAI GPT-4o
    const chapterPromises = layoutData.chapters.map(async (chapter, index) => {
      try {
        console.log(`Generating content for chapter ${index + 1}: ${chapter.chapterName}`);
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator creating detailed course content. Generate comprehensive educational content in valid JSON format with HTML-formatted text.'
            },
            {
              role: 'user',
              content: CHAPTER_CONTENT_PROMPT + JSON.stringify(chapter)
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        const text = completion.choices[0].message.content;
        const chapterContent = JSON.parse(text);

        console.log(`Generated content for chapter: ${chapter.chapterName}`);

        // Get YouTube videos for each topic if includeVideo is true
        const topicsWithVideos = await Promise.all(
          (chapter.topics || []).map(async (topicName) => {
            let videos = [];
            if (course.includeVideo) {
              videos = await getYouTubeVideos(`${chapter.chapterName} ${topicName}`);
            }

            // Find matching content from AI response
            const topicContent = chapterContent.topics?.find(t => 
              t.topicName === topicName || 
              t.topicName?.toLowerCase().includes(topicName.toLowerCase())
            );

            return {
              title: topicName,
              content: topicContent?.content || `<h3>${topicName}</h3><p>Content will be added soon.</p>`,
              videos: videos
            };
          })
        );

        return {
          topics: topicsWithVideos
        };
      } catch (error) {
        console.error(`Error generating content for chapter ${chapter.chapterName}:`, error);
        
        // Return basic structure with error
        const topicsWithError = (chapter.topics || []).map(topicName => ({
          title: topicName,
          content: `<h3>${topicName}</h3><p>Error generating content. Please try again.</p>`,
          videos: []
        }));

        return {
          topics: topicsWithError,
          error: error.message
        };
      }
    });

    const chaptersContent = await Promise.all(chapterPromises);

    console.log('All chapters generated successfully');

    // Update course with generated content (stored as array for direct indexing)
    await course.update({
      courseContent: chaptersContent,
      status: 'published'
    });

    res.json({
      success: true,
      courseId: course.id,
      courseName: course.name,
      message: 'Course content generated successfully',
      chaptersGenerated: chaptersContent.length
    });
  } catch (error) {
    console.error('Course content generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate course content',
      error: error.message
    });
  }
};

// @desc    Get all courses for user
// @route   GET /api/courses
// @access  Private
export const getUserCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['courseContent'] } // Exclude heavy content field
    });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:courseId
// @access  Private
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, userId: req.userId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:courseId
// @access  Private
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, userId: req.userId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

// Update completed chapters for a course
export const updateCompletedChapters = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { completedChapters } = req.body;

    const course = await Course.findOne({
      where: { id: courseId, userId: req.userId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update completed chapters
    course.completedChapters = completedChapters;
    await course.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      completedChapters: course.completedChapters
    });
  } catch (error) {
    console.error('Update completed chapters error:', error);
    res.status(500).json({
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

// Helper function to generate banner image
const generateBannerImage = async (prompt) => {
  try {
    const AI_GURU_LAB_API = process.env.AI_GURU_LAB_API;
    
    if (!AI_GURU_LAB_API) {
      console.log('AI_GURU_LAB_API not configured, using placeholder image');
      return 'https://placehold.co/1024x576/6366f1/ffffff?text=Course+Banner';
    }

    const response = await axios.post(
      'https://aigurulab.tech/api/generate-image',
      {
        width: 1024,
        height: 576,
        input: prompt,
        model: 'sdxl',
        aspectRatio: '16:9'
      },
      {
        headers: {
          'x-api-key': AI_GURU_LAB_API,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.image || 'https://placehold.co/1024x576/6366f1/ffffff?text=Course+Banner';
  } catch (error) {
    console.error('Image generation error:', error.message);
    return 'https://placehold.co/1024x576/6366f1/ffffff?text=Course+Banner';
  }
};

// Helper function to get YouTube videos
const getYouTubeVideos = async (topic) => {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    if (!YOUTUBE_API_KEY) {
      console.log('YouTube API key not configured');
      return [];
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: topic,
        maxResults: 5,
        type: 'video',
        key: YOUTUBE_API_KEY
      },
      timeout: 10000
    });

    return response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error('YouTube API error:', error.message);
    return [];
  }
};
