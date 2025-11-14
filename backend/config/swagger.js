import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SDG 8 Career Platform API',
      version: '1.0.0',
      description: 'API documentation for the SDG 8: Decent Work and Economic Growth Career Platform. This platform provides AI-powered career guidance, job matching, personalized learning roadmaps, interview preparation, and comprehensive analytics.',
      contact: {
        name: 'API Support',
        email: 'support@sdg8platform.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.sdg8platform.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            fullName: { type: 'string', example: 'John Doe' },
            educationLevel: { type: 'string', example: "Bachelor's Degree" },
            department: { type: 'string', example: 'Computer Science' },
            experienceLevel: { type: 'string', example: 'Intermediate' },
            preferredCareerTrack: { type: 'string', example: 'Software Development' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Full Stack Developer' },
            company: { type: 'string', example: 'Tech Corp' },
            location: { type: 'string', example: 'New York, NY' },
            type: { type: 'string', enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], example: 'Full-time' },
            experienceLevel: { type: 'string', example: 'Mid-Level' },
            salary: { type: 'string', example: '$80,000 - $120,000' },
            description: { type: 'string', example: 'We are looking for a talented Full Stack Developer...' },
            requirements: { type: 'array', items: { type: 'string' } },
            requiredSkills: { type: 'array', items: { type: 'string' } },
            responsibilities: { type: 'array', items: { type: 'string' } },
            benefits: { type: 'array', items: { type: 'string' } },
            applicationUrl: { type: 'string', example: 'https://example.com/apply' },
            postedDate: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean', example: true }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'JavaScript Fundamentals' },
            targetSkill: { type: 'string', example: 'JavaScript' },
            difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'], example: 'Beginner' },
            estimatedDuration: { type: 'string', example: '4 weeks' },
            courseData: { type: 'object', description: 'AI-generated course content with chapters and lessons' },
            completedChapters: { type: 'array', items: { type: 'number' } },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Roadmap: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            targetRole: { type: 'string', example: 'Full Stack Developer' },
            timeframe: { type: 'string', example: '3 months' },
            weeklyHours: { type: 'integer', example: 10 },
            currentSkills: { type: 'array', items: { type: 'string' } },
            roadmapData: { type: 'object', description: 'AI-generated roadmap with phases, topics, and projects' },
            progress: { type: 'object', description: 'Phase completion tracking' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Interview: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            jobRole: { type: 'string', example: 'Frontend Developer' },
            experienceLevel: { type: 'string', example: 'Mid-Level' },
            focusAreas: { type: 'array', items: { type: 'string' } },
            questions: { type: 'array', items: { type: 'object' } },
            answers: { type: 'array', items: { type: 'object' } },
            feedback: { type: 'array', items: { type: 'object' } },
            overallScore: { type: 'number', example: 85 },
            status: { type: 'string', enum: ['in_progress', 'completed'], example: 'completed' },
            completedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Detailed error information' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request - invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized - invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication and registration endpoints' },
      { name: 'Users', description: 'User profile management' },
      { name: 'Jobs', description: 'Job listings and recommendations' },
      { name: 'Courses', description: 'AI-generated personalized courses' },
      { name: 'Roadmaps', description: 'Career learning roadmaps' },
      { name: 'Interviews', description: 'AI mock interview preparation' },
      { name: 'Resources', description: 'Learning resources and materials' },
      { name: 'Recommendations', description: 'AI-powered recommendations' },
      { name: 'Analytics', description: 'Platform analytics and insights' },
      { name: 'CV Generation', description: 'AI-enhanced CV and resume generation' }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
