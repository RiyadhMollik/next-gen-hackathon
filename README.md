# SDG 8 Career Platform - AI-Powered Youth Employment Solution

**SDG 8: Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all**

A comprehensive AI-powered fullstack web application that empowers students, fresh graduates, and job seekers with intelligent career guidance, personalized learning paths, and fraud-protected interview preparation.

## 🎯 Project Overview

This platform revolutionizes career development by providing:
- **AI-Powered Career Guidance** - OpenAI GPT-4o integration for intelligent recommendations
- **Personalized Learning Roadmaps** - Dynamic career path generation with AI
- **AI-Generated Courses** - Custom course creation based on user skills and goals
- **Mock Interview Practice** - AI-driven interview preparation with real-time feedback
- **Fraud Detection System** - OpenCV and AI Vision monitoring for interview integrity
- **Intelligent Job Matching** - Advanced algorithms for optimal job recommendations
- **CV Enhancement** - AI-powered resume optimization and ATS compatibility
- **Real-time Analytics** - SDG impact tracking and platform insights
- **Career Chatbot** - 24/7 AI assistant for career guidance

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with custom green theme
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **html2canvas** - Roadmap image export functionality
- **Socket.IO Client** - Real-time fraud detection alerts
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **Redis** - Caching layer for performance
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - GPT-4o for AI features
- **Swagger/OpenAPI** - Comprehensive API documentation
- **Socket.IO** - WebSocket for real-time features

### AI & Computer Vision
- **Python 3.10+** - For fraud detection service
- **Flask** - Python web framework
- **OpenCV** - Computer vision for video analysis
- **MediaPipe** - Face detection and pose estimation
- **OpenAI Vision API** - Advanced behavior analysis
- **Flask-SocketIO** - Real-time WebSocket communication

### Career Bot Service
- **FastAPI** - High-performance Python API
- **Sentence Transformers** - Semantic search
- **FAISS** - Vector similarity search
- **OpenAI Embeddings** - Text embeddings generation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Redis** (Required) - [Download](https://redis.io/download/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/downloads/)
- **OpenAI API Key** - [Get Key](https://platform.openai.com/api-keys)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```powershell
git clone <your-repo-url>
cd Hackathon
```

### 2. Backend Setup

#### Install Dependencies

```powershell
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hackathon_db
DB_PORT=3306

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o

# CORS
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_ALT=http://localhost:5174

# External Services
CAREER_BOT_URL=http://localhost:8000
FRAUD_DETECTION_URL=http://localhost:5001
```

#### Create MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE hackathon_db;
```

#### Run Database Migrations

```powershell
node addFraudDetectionColumns.js
```

#### Seed the Database

This will create tables and populate them with sample data:

```powershell
npm run seed
```

### 3. Fraud Detection Service Setup

```powershell
cd Guard
pip install -r requirements.txt
```

Create a `.env` file in the `Guard` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5001
```

### 4. Career Bot Service Setup (Optional)

```powershell
cd faq_career_bot
pip install -r requirements.txt
```

### 5. Frontend Setup

Open a new terminal window:

```powershell
cd frontend
npm install
```

## 🏃 Running the Application

### 1. Start Redis

```powershell
redis-server
```

### 2. Start the Backend Server

In the `backend` directory:

```powershell
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend will run on **http://localhost:5000**

API Documentation available at: **http://localhost:5000/api-docs**

### 3. Start the Fraud Detection Service

In the `Guard` directory:

```powershell
python fraudDetectionAPI.py
```

The fraud detection service will run on **http://localhost:5001**

### 4. Start the Career Bot Service (Optional)

In the `faq_career_bot` directory:

```powershell
python career_bot_enhanced.py
```

The career bot will run on **http://localhost:8000**

### 5. Start the Frontend Development Server

In the `frontend` directory:

```powershell
npm run dev
```

The frontend will run on **http://localhost:5173** or **http://localhost:5174**

## 📱 Complete Features List

### ✅ 1. Authentication & User Management
- User registration with comprehensive validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- User profile with:
  - Full name, email, education level
  - Department, experience level
  - Preferred career track
  - Skills with proficiency levels

### ✅ 2. AI-Powered Course Generation
- **Custom Course Creation** - Generate personalized courses using OpenAI GPT-4o
- **Intelligent Layout** - AI structures course chapters and topics
- **Progress Tracking** - Mark completed chapters
- **Skill-Based Recommendations** - Courses tailored to user skill gaps
- **Dynamic Content** - AI generates detailed learning materials
- **Multi-Level Support** - Beginner, Intermediate, Advanced courses

### ✅ 3. Career Roadmap System
- **AI-Generated Roadmaps** - Personalized career paths using GPT-4o
- **Interactive Visualization** - Beautiful phase-based roadmap display
- **Progress Management** - Track completion of each phase
- **Image Export** - Download roadmaps as PNG/JPG using html2canvas
- **Regeneration** - Create new roadmaps with different parameters
- **Timeframe Customization** - 1-6 months or custom duration
- **Weekly Hours Planning** - Personalized pacing

### ✅ 4. Mock Interview Preparation
- **AI Interview Generation** - GPT-4o creates role-specific questions
- **Real-time Feedback** - Instant AI evaluation of answers
- **Fraud Detection Integration** - Computer vision monitoring
- **Performance Analytics** - Detailed scoring and improvement suggestions
- **Multiple Formats** - Technical, behavioral, and case interviews
- **Experience-Adaptive** - Questions adjust to user experience level

### ✅ 5. Fraud Detection System (Interview Integrity)
- **Video Monitoring** - OpenCV captures and analyzes webcam feed
- **Face Detection** - MediaPipe tracks face presence and count
- **Head Pose Analysis** - Detects when user looks away
- **AI Vision Analysis** - OpenAI Vision API evaluates suspicious behavior
- **Tab Switch Detection** - Browser focus monitoring
- **Real-time Alerts** - WebSocket notifications for violations
- **Fraud Scoring** - Cumulative integrity score
- **Behavior Reports** - Detailed logs saved with interview

### ✅ 6. Intelligent Job Matching
- **Advanced Algorithms** - Multi-factor matching system
- **Skill Overlap Calculation** - Precise compatibility scoring
- **Career Track Alignment** - Bonus for matching career paths
- **Experience Level Matching** - Appropriate job suggestions
- **Location Preferences** - Remote and on-site filtering
- **Transparent Scoring** - Shows match percentage and reasons
- **Job Type Filtering** - Internship, Full-time, Part-time, Freelance

### ✅ 7. Learning Resources & Recommendations
- **Curated Resources** - YouTube, Coursera, Udemy, edX, etc.
- **AI-Powered Suggestions** - Resources based on skill gaps
- **Platform Filtering** - Filter by learning platform
- **Cost Filtering** - Free vs Paid resources
- **Skill Level Matching** - Beginner to Advanced
- **Direct Links** - One-click access to learning materials

### ✅ 8. AI CV Enhancement
- **Resume Optimization** - AI improves CV content
- **ATS Compatibility** - Optimized for applicant tracking systems
- **Professional Formatting** - Clean, modern layouts
- **Skill Highlighting** - Emphasizes relevant competencies
- **Achievement Quantification** - AI adds metrics and impact

### ✅ 9. Career Chatbot
- **24/7 AI Assistant** - Always available for career guidance
- **Semantic Search** - FAISS vector similarity matching
- **Context-Aware Responses** - Understands conversation history
- **FAQ Database** - Pre-trained on career-related questions
- **Natural Language** - Conversational interface

### ✅ 10. Analytics Dashboard
- **SDG Impact Tracking** - Platform contribution to SDG 8
- **User Growth Stats** - Registration and engagement metrics
- **Job Market Trends** - Skills demand analysis
- **Interview Performance** - Success rate tracking
- **Skill Gap Identification** - Market needs vs user skills
- **Admin Analytics** - Comprehensive platform insights

### ✅ 11. API Documentation
- **Swagger/OpenAPI 3.0** - Complete API documentation
- **Interactive Testing** - Try endpoints directly in browser
- **Schema Definitions** - Clear request/response formats
- **Authentication Guide** - JWT token usage
- **Organized by Tags** - Easy navigation
- **Live at**: http://localhost:5000/api-docs

### ✅ 12. Profile Management
- **Comprehensive Profiles** - Education, experience, skills
- **Skill CRUD Operations** - Add, edit, delete skills
- **Proficiency Levels** - Beginner to Expert tracking
- **Project Descriptions** - Portfolio showcase
- **CV Text Storage** - For AI analysis
- **Career Interests** - Target roles and tracks

### ✅ 13. User Dashboard
- **Personalized Overview** - User-specific statistics
- **Recommendations Display** - Top jobs and resources
- **Roadmap Section** - View and regenerate roadmaps
- **Quick Navigation** - Access all features
- **Progress Tracking** - Courses, interviews, skills
- **AI-Powered Insights** - GPT-4o recommendations

### ✅ 14. Security & Performance
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Comprehensive validation
- **SQL Injection Prevention** - Sequelize ORM protection
- **Redis Caching** - Fast response times
- **CORS Configuration** - Secure cross-origin requests
- **Rate Limiting** - API abuse prevention

### ✅ 15. Theme & UI/UX
- **Consistent Green Theme** - Emerald/Mint color scheme
- **Responsive Design** - Mobile, tablet, desktop
- **Animated Backgrounds** - Orb animations
- **Smooth Transitions** - Professional feel
- **Accessibility** - Clear navigation and contrast
- **Loading States** - User feedback during operations
- **Error Handling** - Graceful error messages

## 🗂️ Project Structure

```
Hackathon/
├── backend/
│   ├── config/
│   │   ├── database.js          # Sequelize configuration
│   │   ├── redis.js             # Redis configuration
│   │   ├── swagger.js           # OpenAPI/Swagger config
│   │   └── config.json          # Sequelize CLI config
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── adminMiddleware.js   # Admin authorization
│   │   ├── cache.js             # Redis caching
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Job.js               # Job model
│   │   ├── Course.js            # AI-generated course model
│   │   ├── Roadmap.js           # Career roadmap model
│   │   ├── Interview.js         # Mock interview model (with fraud detection)
│   │   ├── LearningResource.js  # Resource model
│   │   ├── UserSkill.js         # Skill model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── profileController.js # Profile management
│   │   ├── courseController.js  # AI course generation
│   │   ├── roadmapController.js # Roadmap generation
│   │   ├── interviewController.js # Interview + fraud detection
│   │   ├── jobController.js     # Job CRUD
│   │   ├── recommendationController.js # AI recommendations
│   │   ├── analyticsController.js # SDG analytics
│   │   ├── cvGenerationController.js # CV enhancement
│   │   └── learningResourceController.js
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints (Swagger documented)
│   │   ├── profileRoutes.js     # Profile endpoints (Swagger documented)
│   │   ├── courseRoutes.js      # Course endpoints (Swagger documented)
│   │   ├── roadmapRoutes.js     # Roadmap endpoints (Swagger documented)
│   │   ├── interviewRoutes.js   # Interview endpoints (Swagger documented)
│   │   ├── jobRoutes.js         # Job endpoints (Swagger documented)
│   │   ├── recommendationRoutes.js # Recommendation endpoints
│   │   ├── analyticsRoutes.js   # Analytics endpoints (Swagger documented)
│   │   ├── cvGenerationRoutes.js # CV endpoints (Swagger documented)
│   │   └── swaggerDocs.js       # Additional API documentation
│   ├── migrations/
│   │   ├── 20241115-add-fraud-detection-columns.js
│   │   └── addFraudDetectionColumns.js
│   ├── seeders/
│   │   ├── data.js              # Seed data
│   │   └── index.js             # Seeder script
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── RoadmapGeneratorModal.jsx # Roadmap creation modal
│   │   │   ├── FraudDetectionMonitor.jsx # Video monitoring component
│   │   │   └── SkillBadge.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx     # Main dashboard with roadmap section
│   │   │   ├── Profile.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Courses.jsx       # AI course generation & management
│   │   │   ├── CoursePage.jsx    # Course detail view
│   │   │   ├── RoadmapViewer.jsx # Roadmap visualization (PNG/JPG export)
│   │   │   ├── MockInterview.jsx # Interview with fraud detection
│   │   │   ├── AnalyticsDashboard.jsx # SDG analytics (green theme)
│   │   │   └── Resources.jsx
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── profileSlice.js
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── api.js           # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Guard/                       # Fraud Detection Service (Python)
│   ├── fraudDetectionAPI.py     # Flask API for video analysis
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # OpenAI API key
│
├── faq_career_bot/             # Career Chatbot Service (Python)
│   ├── career_bot_enhanced.py   # FastAPI chatbot
│   ├── requirements.txt
│   └── faqs.json               # FAQ database
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile Management
- `GET /api/profile/me` - Get user profile with skills
- `PUT /api/profile/me` - Update profile
- `POST /api/profile/skills` - Add skill
- `DELETE /api/profile/skills/:id` - Delete skill

### AI Course Generation
- `POST /api/courses/generate-layout` - Generate course structure with AI
- `POST /api/courses/generate-content/:courseId` - Generate detailed content
- `GET /api/courses` - Get all user courses
- `GET /api/courses/:courseId` - Get course by ID
- `PUT /api/courses/:courseId/progress` - Update completion progress
- `DELETE /api/courses/:courseId` - Delete course

### Career Roadmaps
- `POST /api/roadmaps/generate` - Generate AI-powered roadmap
- `GET /api/roadmaps/active` - Get active roadmap
- `GET /api/roadmaps` - Get all user roadmaps
- `GET /api/roadmaps/:roadmapId` - Get roadmap by ID
- `PUT /api/roadmaps/:roadmapId/progress` - Update roadmap progress
- `DELETE /api/roadmaps/:roadmapId` - Delete roadmap

### Mock Interviews (with Fraud Detection)
- `POST /api/interviews/generate` - Generate AI interview questions
- `PUT /api/interviews/:interviewId/start` - Start interview session
- `POST /api/interviews/:interviewId/answer` - Submit answer & get AI feedback
- `POST /api/interviews/:interviewId/complete` - Complete interview
- `GET /api/interviews` - Get all user interviews
- `GET /api/interviews/:interviewId` - Get interview with fraud report

### Jobs & Matching
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)

### Learning Resources
- `GET /api/resources` - Get all resources (with filters)
- `GET /api/resources/:id` - Get resource by ID

### AI Recommendations
- `GET /api/recommendations/jobs` - Get personalized job matches
- `GET /api/recommendations/resources` - Get learning resources
- `GET /api/recommendations/dashboard` - Get dashboard data with AI insights

### Analytics (Admin)
- `GET /api/analytics/sdg-impact` - SDG 8 impact metrics
- `GET /api/analytics/user-growth` - User growth statistics
- `GET /api/analytics/job-trends` - Job market trends
- `GET /api/analytics/interview-performance` - Interview success rates

### CV Enhancement
- `POST /api/cv-generation/generate-ai-cv` - AI-enhance CV
- `POST /api/cv-generation/save-enhancements` - Save CV improvements

### Swagger Documentation
- `GET /api-docs` - Interactive API documentation (Swagger UI)
- `GET /api-docs.json` - OpenAPI 3.0 specification

### Fraud Detection Service (Python - Port 5001)
- `POST /api/fraud/analyze-frame` - Analyze video frame for fraud
- `WebSocket /socket.io` - Real-time fraud alerts

### Career Bot Service (Python - Port 8000)
- `POST /chat` - Chat with AI career advisor
- `GET /job-match/:userId` - Get AI job matches

## 🎨 UI Features & Theme

- **Consistent Green Theme** - Emerald (#059669), Green (#10b981), Mint color palette
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Animated Backgrounds** - Floating orb animations on key pages
- **Clean Interface** - Focus on usability and accessibility
- **Color-coded Badges** - Easy identification of job types, costs, skill levels
- **Interactive Filters** - Real-time filtering with smooth animations
- **Skill Matching Indicators** - Visual feedback on compatibility
- **Image Export** - Download roadmaps as PNG/JPG with high quality
- **Real-time Alerts** - Toast notifications for fraud detection
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Dark Mode Ready** - Consistent color scheme throughout

## 📊 Database Schema

### Users Table
- id, fullName, email, password (hashed)
- educationLevel, department, experienceLevel
- preferredCareerTrack, cvText, projectDescriptions
- targetRoles, role (user/admin)
- timestamps

### Jobs Table
- id, title, company, location, description
- requiredSkills (JSON array)
- experienceLevel, jobType, careerTrack
- salary, applicationDeadline, isActive
- timestamps

### Courses Table (AI-Generated)
- id, userId, targetSkill, difficulty
- estimatedDuration, courseData (JSON)
- completedChapters (JSON array)
- isCompleted, completionDate
- timestamps

### Roadmaps Table
- id, userId, targetRole, timeframe
- weeklyHours, currentSkills (JSON)
- roadmapData (JSON with phases)
- progress (JSON), isActive
- timestamps

### Interviews Table (with Fraud Detection)
- id, userId, jobTitle, jobDescription
- userSkills (JSON), questions (JSON)
- userAnswers (JSON), feedback (JSON)
- overallScore, status, duration
- **integrityReport (JSON)** - Fraud detection results
- **behaviorReport (JSON)** - Video analysis logs
- completedAt, timestamps

### LearningResources Table
- id, title, platform, url
- relatedSkills (JSON), cost (Free/Paid)
- description, duration, level
- timestamps

### UserSkills Table
- id, userId, skillName
- proficiencyLevel (Beginner/Intermediate/Advanced/Expert)
- timestamps

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with 30-day expiry
- **Password Hashing** - bcrypt with salt rounds
- **Protected Routes** - Middleware-based authorization
- **Role-Based Access Control** - Admin vs User permissions
- **Input Validation** - Comprehensive validation on all inputs
- **SQL Injection Prevention** - Sequelize ORM parameterized queries
- **XSS Protection** - Content sanitization
- **CORS Configuration** - Controlled cross-origin access
- **Rate Limiting** - API abuse prevention
- **Environment Variables** - Sensitive data in .env files
- **Fraud Detection** - AI-powered interview integrity monitoring
- **Session Management** - Secure token storage and refresh

## 🚀 AI Features Powered by OpenAI GPT-4o

### 1. **AI Course Generation**
- Analyzes user skill gaps
- Creates personalized course structure
- Generates chapter-by-chapter content
- Adapts difficulty based on user level
- Provides learning objectives and projects

### 2. **Career Roadmap Planning**
- Considers user's current skills and target role
- Creates phase-based learning paths
- Estimates realistic timelines
- Suggests weekly study plans
- Adapts to available hours per week

### 3. **Mock Interview Preparation**
- Generates role-specific interview questions
- Evaluates user answers in real-time
- Provides detailed feedback and improvements
- Scores responses on multiple criteria
- Suggests better answer approaches

### 4. **Job Recommendations**
- Analyzes skill compatibility
- Considers career track alignment
- Evaluates experience level match
- Provides transparent scoring
- Explains match reasoning

### 5. **Learning Resource Suggestions**
- Identifies skill gaps
- Recommends upskilling paths
- Prioritizes based on career goals
- Balances free and paid resources

### 6. **CV Enhancement**
- Optimizes resume content
- Improves ATS compatibility
- Highlights relevant skills
- Quantifies achievements
- Professional formatting

### 7. **Career Chatbot**
- Answers career-related questions
- Provides personalized guidance
- Uses semantic search for accuracy
- Context-aware conversations

### 8. **Fraud Detection (OpenAI Vision)**
- Analyzes video frames for suspicious behavior
- Detects unusual patterns
- Identifies potential cheating
- Provides detailed behavior reports

## 🐛 Troubleshooting

### MySQL Connection Issues
```powershell
# Check if MySQL is running
mysql --version

# Test connection
mysql -u root -p

# Create database if missing
CREATE DATABASE hackathon_db;
```

### Redis Connection Issues
```powershell
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis server
redis-server

# Check Redis connection
redis-cli
```

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Check other ports
netstat -ano | findstr :5001  # Fraud Detection
netstat -ano | findstr :5173  # Frontend
netstat -ano | findstr :8000  # Career Bot
```

### Python Package Issues
```powershell
# Reinstall packages
pip uninstall opencv-python opencv-contrib-python
pip install opencv-python opencv-contrib-python

# Check Python version
python --version
# Should be 3.10 or higher
```

### OpenAI API Issues
```env
# Verify API key in .env files
OPENAI_API_KEY=sk-...  # Should start with sk-

# Check API quota
# Visit: https://platform.openai.com/usage
```

### Database Migration Issues
```powershell
# Run fraud detection columns script
cd backend
node addFraudDetectionColumns.js

# Reset database (WARNING: Deletes all data)
DROP DATABASE hackathon_db;
CREATE DATABASE hackathon_db;
npm run seed
```

### Frontend Build Issues
```powershell
# Clear node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

### Swagger Documentation Not Loading
```powershell
# Verify server is running
# Visit: http://localhost:5000/api-docs

# Check for errors in backend console
# Restart backend server
cd backend
npm run dev
```

## 🌟 Key Innovations

### 1. **Complete AI Integration**
- OpenAI GPT-4o powers 8+ features
- Seamless AI-to-database workflow
- Real-time AI feedback and generation

### 2. **Interview Fraud Detection**
- First-of-its-kind computer vision monitoring
- Multi-layer detection (face, pose, behavior)
- AI Vision API for advanced analysis
- Real-time WebSocket alerts

### 3. **Visual Roadmap Export**
- Interactive roadmap visualization
- Export as PNG/JPG images
- High-quality rendering with html2canvas
- Share career plans easily

### 4. **Comprehensive API Documentation**
- Full Swagger/OpenAPI 3.0 implementation
- Interactive API testing
- Clear schema definitions
- Authentication examples

### 5. **Unified Green Theme**
- Consistent design across all pages
- Professional emerald/mint palette
- Animated backgrounds
- Accessible and responsive

### 6. **Multi-Service Architecture**
- Node.js backend (main API)
- Python fraud detection service
- Python career bot service
- Redis caching layer
- MySQL database

## 🎯 SDG 8 Impact

This platform directly contributes to **SDG 8: Decent Work and Economic Growth** by:

- **Reducing Youth Unemployment** - AI-powered job matching connects youth to opportunities
- **Skill Development** - Personalized learning paths bridge skill gaps
- **Fair Employment** - Interview fraud detection ensures merit-based hiring
- **Career Guidance** - 24/7 AI chatbot provides accessible advice
- **Analytics Tracking** - Measures platform impact on employment metrics
- **Inclusive Access** - Free resources and tools for all users
- **Quality Employment** - Matches users to roles aligned with their skills
- **Economic Growth** - Prepares workforce for modern job market

**Platform Metrics:**
- Users helped: Tracked in analytics dashboard
- Skills developed: Real-time skill tracking
- Jobs matched: AI-powered recommendations
- Courses completed: Progress monitoring
- Interviews practiced: Success rate analytics

## 📚 Technologies Used

### Frontend Stack
- React 18.2, Vite 4.4
- Tailwind CSS 3.3, Framer Motion
- Redux Toolkit, React Router 6
- Axios, html2canvas, socket.io-client

### Backend Stack
- Node.js 22.14, Express 4.18
- Sequelize 6.37 (MySQL ORM)
- Redis 4.6, JWT, bcryptjs
- OpenAI 4.28, Swagger/OpenAPI

### Python Services
- Flask 3.0, Flask-SocketIO
- OpenCV 4.8, MediaPipe 0.10
- FastAPI, Sentence Transformers
- FAISS, python-dotenv

### Development Tools
- Git, npm, pip
- MySQL Workbench
- Postman, Swagger UI
- VS Code

## 📖 Documentation

- **API Documentation**: http://localhost:5000/api-docs
- **Swagger Spec**: http://localhost:5000/api-docs.json
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Fraud Detection**: http://localhost:5001
- **Career Bot**: http://localhost:8000

## 👥 Team & Collaboration

### Setup for New Team Members

1. **Clone Repository**
```powershell
git clone https://github.com/RiyadhMollik/next-gen-hackathon.git
cd next-gen-hackathon
```

2. **Install Dependencies**
```powershell
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Python services
cd ../Guard && pip install -r requirements.txt
cd ../faq_career_bot && pip install -r requirements.txt
```

3. **Configure Environment**
- Copy `.env.example` to `.env` in each directory
- Add your OpenAI API key
- Update database credentials

4. **Initialize Database**
```powershell
cd backend
node addFraudDetectionColumns.js
npm run seed
```

5. **Start Services** (in separate terminals)
```powershell
# Terminal 1: Redis
redis-server

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Fraud Detection
cd Guard && python fraudDetectionAPI.py

# Terminal 4: Career Bot (optional)
cd faq_career_bot && python career_bot_enhanced.py

# Terminal 5: Frontend
cd frontend && npm run dev
```

### Git Workflow
```powershell
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_NAME=hackathon_db
DB_USER=root
DB_PASSWORD=your_password
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Fraud Detection (.env)
```env
OPENAI_API_KEY=sk-your-key-here
PORT=5001
```

## 📝 License

MIT License - Free to use for educational and development purposes.

## 🙏 Acknowledgments

- OpenAI for GPT-4o and Vision API
- MediaPipe for face detection
- OpenCV for computer vision
- React and Vite communities
- Open source contributors

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check API documentation at `/api-docs`
- Review troubleshooting section above

---

**Built with ❤️ for SDG 8: Decent Work and Economic Growth**

*Empowering youth through AI-powered career development*
