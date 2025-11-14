/**
 * @swagger
 * /courses/generate:
 *   post:
 *     summary: Generate AI-powered personalized course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetSkill
 *               - difficulty
 *             properties:
 *               targetSkill:
 *                 type: string
 *                 example: JavaScript
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: Beginner
 *               estimatedDuration:
 *                 type: string
 *                 example: 4 weeks
 *     responses:
 *       201:
 *         description: Course generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 * 
 * /courses:
 *   get:
 *     summary: Get all user courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 * 
 * /courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 * 
 * /courses/{courseId}/progress:
 *   put:
 *     summary: Update course progress
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completedChapters:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Progress updated successfully
 * 
 * /roadmaps/generate:
 *   post:
 *     summary: Generate personalized career roadmap
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetRole
 *               - timeframe
 *             properties:
 *               targetRole:
 *                 type: string
 *                 example: Full Stack Developer
 *               currentSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [JavaScript, HTML, CSS]
 *               timeframe:
 *                 type: string
 *                 example: 3 months
 *               weeklyHours:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Roadmap generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 roadmap:
 *                   $ref: '#/components/schemas/Roadmap'
 * 
 * /roadmaps/active:
 *   get:
 *     summary: Get user's active roadmap
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active roadmap
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 roadmap:
 *                   $ref: '#/components/schemas/Roadmap'
 * 
 * /roadmaps/{roadmapId}/progress:
 *   put:
 *     summary: Update roadmap progress
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: object
 *                 example: { "phase_1": true, "phase_2": false }
 *     responses:
 *       200:
 *         description: Progress updated successfully
 * 
 * /interviews/start:
 *   post:
 *     summary: Start AI mock interview
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobRole
 *               - experienceLevel
 *             properties:
 *               jobRole:
 *                 type: string
 *                 example: Frontend Developer
 *               experienceLevel:
 *                 type: string
 *                 example: Mid-Level
 *               focusAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [React, JavaScript, Problem Solving]
 *     responses:
 *       201:
 *         description: Interview session started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 * 
 * /interviews/{interviewId}/answer:
 *   post:
 *     summary: Submit answer to interview question
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - answer
 *             properties:
 *               questionId:
 *                 type: integer
 *                 example: 1
 *               answer:
 *                 type: string
 *                 example: My answer to the interview question...
 *     responses:
 *       200:
 *         description: Answer submitted and evaluated
 * 
 * /recommendations/dashboard:
 *   get:
 *     summary: Get personalized dashboard recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 stats:
 *                   type: object
 *                 recommendedJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 recommendedResources:
 *                   type: array
 * 
 * /cv-generation/generate-ai-cv:
 *   post:
 *     summary: Generate AI-enhanced CV
 *     tags: [CV Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userData
 *             properties:
 *               userData:
 *                 type: object
 *                 properties:
 *                   personalInfo:
 *                     type: object
 *                   workExperience:
 *                     type: array
 *                   projects:
 *                     type: array
 *                   skills:
 *                     type: array
 *     responses:
 *       200:
 *         description: AI-enhanced CV generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 enhancedCV:
 *                   type: object
 * 
 * /analytics/sdg-impact:
 *   get:
 *     summary: Get SDG 8 impact analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform impact analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     skillsDemand:
 *                       type: array
 *                     skillGaps:
 *                       type: array
 * 
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               educationLevel:
 *                 type: string
 *               department:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               preferredCareerTrack:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 * 
 * /profile/skills:
 *   post:
 *     summary: Add skills to user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     skillName:
 *                       type: string
 *                     proficiencyLevel:
 *                       type: string
 *                       enum: [Beginner, Intermediate, Advanced, Expert]
 *     responses:
 *       201:
 *         description: Skills added successfully
 * 
 * /resources:
 *   get:
 *     summary: Get learning resources
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of learning resources
 * 
 * /chat:
 *   post:
 *     summary: Chat with AI career advisor
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: What skills should I learn for web development?
 *               conversationHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: string
 */
