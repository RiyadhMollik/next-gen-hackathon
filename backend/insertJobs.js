import mysql from 'mysql2/promise';

const jobs = [
  {
    title: "AI Engineer",
    company: "Enosis",
    location: "Remote",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "Natural Language Processing"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "AI & Machine Learning",
    description: "Join our AI team to develop cutting-edge machine learning solutions. Work with state-of-the-art NLP models and deep learning frameworks to solve real-world problems.",
    salary: "$800-1200/month"
  },
  {
    title: "AI Research Intern",
    company: "Innovative Skills",
    location: "Remote",
    requiredSkills: ["Machine Learning", "Data Analysis", "Research", "AI Model Development", "Python"],
    experienceLevel: "Internship",
    jobType: "Internship",
    careerTrack: "AI & Machine Learning",
    description: "Research internship focused on AI model development and experimentation. Participate in cutting-edge AI research projects and contribute to academic publications.",
    salary: "$400-600/month"
  },
  {
    title: "Junior AI Researcher",
    company: "Innovative Skills",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["AI Research", "Machine Learning", "Data Modeling", "Deep Learning", "Neural Networks"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "AI & Machine Learning",
    description: "Conduct AI research, develop neural network models, and contribute to innovative machine learning solutions. Work alongside experienced researchers in a collaborative environment.",
    salary: "$1000-1500/month"
  },
  {
    title: "Junior Full Stack Developer",
    company: "Join Venture AI",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["JavaScript", "Node.js", "React", "Express", "MongoDB"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Full Stack Development",
    description: "Develop modern web applications using MERN stack. Build responsive frontends with React and robust backends with Node.js and MongoDB.",
    salary: "$700-1000/month"
  },
  {
    title: "Junior App Developer",
    company: "Bdtask",
    location: "Remote",
    requiredSkills: ["Java", "Android Development", "Kotlin", "App Development", "SQLite"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Mobile App Development",
    description: "Build native Android applications using Java and Kotlin. Work on consumer-facing mobile apps with millions of users.",
    salary: "$600-900/month"
  },
  {
    title: "iOS App Developer Intern",
    company: "Technext",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Swift", "Xcode", "iOS Development", "Objective-C", "App Design"],
    experienceLevel: "Internship",
    jobType: "Internship",
    careerTrack: "Mobile App Development",
    description: "Learn iOS app development with Swift and Xcode. Contribute to real iOS projects and gain hands-on experience in mobile development.",
    salary: "$300-500/month"
  },
  {
    title: "Junior Android Developer",
    company: "MSoft BD Limited",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Java", "Android Studio", "Kotlin", "Mobile App Development"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Mobile App Development",
    description: "Develop Android applications using modern development practices. Work with Material Design guidelines and the latest Android SDK.",
    salary: "$650-950/month"
  },
  {
    title: "Mobile App Developer",
    company: "SoftVence Agency",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Flutter", "Dart", "Mobile App Development", "Cross-platform", "JavaScript"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "Mobile App Development",
    description: "Create cross-platform mobile applications using Flutter. Build beautiful, natively compiled applications for mobile from a single codebase.",
    salary: "$900-1300/month"
  },
  {
    title: "Junior iOS Developer",
    company: "Pridesys IT",
    location: "Remote",
    requiredSkills: ["Swift", "Objective-C", "iOS Development", "Xcode", "App Development"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Mobile App Development",
    description: "Develop iOS applications with Swift and Objective-C. Work on enterprise-level apps with focus on performance and user experience.",
    salary: "$700-1000/month"
  },
  {
    title: "Junior Data Analyst",
    company: "SELISE Digital Platforms",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Excel", "SQL", "Data Visualization", "Data Cleaning", "Pandas"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Data Science & Analytics",
    description: "Analyze business data, create visualizations, and provide insights. Work with SQL databases and Python for data analysis and reporting.",
    salary: "$600-900/month"
  },
  {
    title: "Data Analyst Intern",
    company: "BJIT",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Excel", "SQL", "Python", "Data Visualization", "Reporting"],
    experienceLevel: "Internship",
    jobType: "Internship",
    careerTrack: "Data Science & Analytics",
    description: "Internship opportunity to learn data analysis techniques. Work with real datasets, create reports, and learn data visualization tools.",
    salary: "$350-550/month"
  },
  {
    title: "Data Science Intern",
    company: "Kaz Software",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Python", "Data Science", "Machine Learning", "Data Analysis", "SQL"],
    experienceLevel: "Internship",
    jobType: "Internship",
    careerTrack: "Data Science & Analytics",
    description: "Gain hands-on experience in data science and machine learning. Work on real-world data science projects and learn from experienced data scientists.",
    salary: "$400-600/month"
  },
  {
    title: "Junior Data Scientist",
    company: "Cefalo",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Python", "Machine Learning", "Data Analysis", "R", "Data Science"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Data Science & Analytics",
    description: "Apply machine learning techniques to solve business problems. Build predictive models and work with large datasets using Python and R.",
    salary: "$800-1200/month"
  },
  {
    title: "Junior Backend Developer",
    company: "TigerIT",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Node.js", "JavaScript", "Database Management", "SQL", "Express"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Backend Development",
    description: "Build scalable backend systems with Node.js and Express. Design and implement RESTful APIs and work with SQL databases.",
    salary: "$650-950/month"
  },
  {
    title: "Product Management Intern",
    company: "Enosis",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Product Management", "Agile", "Market Research", "Project Management"],
    experienceLevel: "Internship",
    jobType: "Internship",
    careerTrack: "Product Management",
    description: "Learn product management fundamentals. Assist in product roadmap planning, user research, and agile project management.",
    salary: "$400-600/month"
  },
  {
    title: "Customer Support Representative",
    company: "Brainstation 23 pvt ltd",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Customer Service", "Communication", "Problem Solving", "Phone Support"],
    experienceLevel: "Fresher",
    jobType: "Part-time",
    careerTrack: "Customer Support",
    description: "Provide excellent customer support via phone and email. Resolve customer issues and ensure customer satisfaction.",
    salary: "$300-500/month"
  },
  {
    title: "Sales Development Representative",
    company: "Vivasoft",
    location: "Dhaka, Bangladesh",
    requiredSkills: ["Sales", "Communication", "CRM", "Customer Engagement", "Lead Generation"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Sales & Marketing",
    description: "Generate leads and develop sales pipeline. Work with CRM systems and engage with potential customers to drive business growth.",
    salary: "$500-800/month"
  }
];

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your password here if needed
    database: 'hackathon_db'
  });

  for (const job of jobs) {
    await connection.execute(
      `INSERT INTO jobs (title, company, location, requiredSkills, experienceLevel, jobType, careerTrack, description, salary, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        job.title,
        job.company,
        job.location,
        JSON.stringify(job.requiredSkills),
        job.experienceLevel,
        job.jobType,
        job.careerTrack,
        job.description,
        job.salary
      ]
    );
  }

  console.log('✅ Successfully inserted', jobs.length, 'jobs');
  await connection.end();
  process.exit(0);
})();