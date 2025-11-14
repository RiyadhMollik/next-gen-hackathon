# Youth Employment & Career Roadmap Platform

**SDG 8: Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all**

A fullstack web application that helps students, fresh graduates, and job seekers discover relevant job opportunities, manage their skills, and find personalized learning resources.

## 🎯 Project Overview

This platform connects youth skills to real employment opportunities by providing:
- User authentication and profile management
- Skill tracking and assessment
- Job recommendations based on user skills
- Learning resource recommendations
- Career roadmap planning tools

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **Redis** - Caching layer
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Redis** (Optional but recommended) - [Download](https://redis.io/download/)

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

```powershell
cp .env.example .env
```

Edit the `.env` file with your configurations:

```env
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=youth_employment_db
DB_PORT=3306

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Create MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE youth_employment_db;
```

#### Seed the Database

This will create tables and populate them with sample data (20 jobs and 20 learning resources):

```powershell
npm run seed
```

### 3. Frontend Setup

Open a new terminal window:

```powershell
cd frontend
npm install
```

## 🏃 Running the Application

### Start the Backend Server

In the `backend` directory:

```powershell
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend will run on **http://localhost:5001**

### Start the Frontend Development Server

In the `frontend` directory:

```powershell
npm run dev
```

The frontend will run on **http://localhost:5173**

### Start Redis (Optional)

If you have Redis installed:

```powershell
redis-server
```

Redis is used for caching API responses. The application will work without it, but performance will be better with Redis running.

## 📱 Features Implemented (Part 1)

### ✅ 1. Authentication & User Management
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- User profile storage with:
  - Full name, email
  - Education level & department
  - Experience level (Fresher/Junior/Mid/Senior)
  - Preferred career track

### ✅ 2. User Profile & Skill Input
- Comprehensive profile page
- Add/edit/delete skills with proficiency levels
- Project descriptions and experience notes
- CV text storage for future AI analysis
- Career interests and target roles

### ✅ 3. Jobs & Opportunities Database
- 20+ seeded job entries
- Job filtering by:
  - Career track
  - Location (including Remote)
  - Job type (Internship/Part-time/Full-time/Freelance)
  - Experience level
  - Search keywords
- Detailed job view with all information
- Skill matching indicators

### ✅ 4. Learning Resources Collection
- 20+ seeded learning resources
- Resources from:
  - YouTube, Coursera, Udemy, edX, Google, AWS
- Filter by:
  - Platform
  - Cost (Free/Paid)
  - Skill level (Beginner/Intermediate/Advanced)
  - Search keywords
- Direct links to learning platforms

### ✅ 5. Basic Matching Logic (Non-AI)
- **Job Recommendations:**
  - Skill overlap calculation
  - Career track matching bonus
  - Experience level alignment
  - Transparent scoring system
  - Shows matched skills and reasons
  
- **Learning Resource Recommendations:**
  - Identifies new skills to learn
  - Suggests upskilling for existing skills
  - Career track relevance scoring
  - Prioritizes free resources

### ✅ 6. User Dashboard
- Profile summary
- Statistics (skills count, recommended jobs, resources)
- Top 5 recommended jobs
- Top 5 recommended learning resources
- Quick navigation to all sections

### ✅ 7. Documentation & Code Quality
- Organized project structure
- Separate routes, controllers, and models
- Environment configuration
- Input validation
- Error handling
- Comments in complex logic

## 🗂️ Project Structure

```
Hackathon/
├── backend/
│   ├── config/
│   │   ├── database.js          # Sequelize configuration
│   │   └── redis.js             # Redis configuration
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── cache.js             # Redis caching
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Job.js               # Job model
│   │   ├── LearningResource.js  # Resource model
│   │   ├── UserSkill.js         # Skill model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── profile.js           # Profile routes
│   │   ├── jobs.js              # Job routes
│   │   ├── learningResources.js # Resource routes
│   │   └── recommendations.js   # Recommendation logic
│   ├── seeders/
│   │   ├── data.js              # Seed data
│   │   └── index.js             # Seeder script
│   ├── .env.example             # Environment template
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
│   │   │   └── SkillBadge.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Jobs.jsx
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
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile/me` - Get user profile
- `PUT /api/profile/me` - Update profile
- `GET /api/profile/skills` - Get user skills
- `POST /api/profile/skills` - Add skill
- `PUT /api/profile/skills/:id` - Update skill
- `DELETE /api/profile/skills/:id` - Delete skill

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/meta/career-tracks` - Get unique career tracks

### Learning Resources
- `GET /api/resources` - Get all resources (with filters)
- `GET /api/resources/:id` - Get resource by ID
- `GET /api/resources/meta/platforms` - Get unique platforms

### Recommendations
- `GET /api/recommendations/jobs` - Get job recommendations
- `GET /api/recommendations/resources` - Get resource recommendations
- `GET /api/recommendations/dashboard` - Get dashboard data

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clean Interface** - Focus on usability over heavy visuals
- **Accessibility** - Clear navigation and readable content
- **Color-coded badges** - Easy identification of job types, costs, levels
- **Interactive filters** - Real-time filtering of jobs and resources
- **Skill matching indicators** - Visual feedback on job compatibility

## 📊 Database Schema

### Users Table
- id, fullName, email, password (hashed)
- educationLevel, department
- experienceLevel, preferredCareerTrack
- cvText, projectDescriptions, targetRoles
- timestamps

### Jobs Table
- id, title, company, location
- requiredSkills (JSON), experienceLevel
- jobType, careerTrack, description, salary
- isActive, timestamps

### LearningResources Table
- id, title, platform, url
- relatedSkills (JSON), cost
- description, duration, level
- timestamps

### UserSkills Table
- id, userId, skillName, proficiency
- timestamps

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation with express-validator
- SQL injection prevention (Sequelize ORM)
- CORS configuration

## 🚧 Future Enhancements (Part 2)

The current implementation is designed to easily integrate:
- AI-powered CV analysis
- Advanced skill gap analysis
- Intelligent career path recommendations
- Natural language processing for job matching
- Automated learning path generation
- Real-time job market insights

## 🐛 Troubleshooting

### MySQL Connection Issues
```powershell
# Check if MySQL is running
mysql --version

# Test connection
mysql -u root -p
```

### Redis Connection Issues
```powershell
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use
```powershell
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

## 👥 Team Collaboration

- Push code to a public repository (GitHub, GitLab)
- Ensure `.env` files are in `.gitignore`
- Share `.env.example` for environment setup
- Document any custom configurations

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 🤝 Contributing

This is a hackathon project. For Part 2, teams will add AI features on-site.

---

**Built with ❤️ for SDG 8: Decent Work and Economic Growth**
