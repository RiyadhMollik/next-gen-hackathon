const jobsData = [
  {
    title: "Frontend Developer Intern",
    company: "TechStart Solutions",
    location: "Remote",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    experienceLevel: "Fresher",
    jobType: "Internship",
    careerTrack: "Web Development",
    description: "Join our team as a frontend developer intern. Learn modern web development practices and work on real projects.",
    salary: "$500-800/month"
  },
  {
    title: "Junior Full Stack Developer",
    company: "Innovation Labs",
    location: "Nairobi, Kenya",
    requiredSkills: ["JavaScript", "Node.js", "React", "MongoDB", "Express"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "Web Development",
    description: "Looking for a passionate full stack developer to join our growing team.",
    salary: "$1500-2500/month"
  },
  {
    title: "UI/UX Design Intern",
    company: "Creative Digital Agency",
    location: "Remote",
    requiredSkills: ["Figma", "Adobe XD", "User Research", "Wireframing"],
    experienceLevel: "Fresher",
    jobType: "Internship",
    careerTrack: "Design",
    description: "Work with experienced designers to create beautiful and functional user interfaces.",
    salary: "$400-700/month"
  },
  {
    title: "Data Analyst",
    company: "DataDriven Inc",
    location: "Kampala, Uganda",
    requiredSkills: ["Excel", "SQL", "Python", "Data Visualization"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "Data Analytics",
    description: "Analyze business data and provide insights to drive decision-making.",
    salary: "$1200-2000/month"
  },
  {
    title: "Content Writer",
    company: "MediaHub Africa",
    location: "Remote",
    requiredSkills: ["Content Writing", "SEO", "Research", "Communication"],
    experienceLevel: "Fresher",
    jobType: "Freelance",
    careerTrack: "Content & Marketing",
    description: "Create engaging content for various digital platforms.",
    salary: "$300-600/month"
  },
  {
    title: "Junior Software Engineer",
    company: "Software Solutions Ltd",
    location: "Kigali, Rwanda",
    requiredSkills: ["Java", "Spring Boot", "MySQL", "Git"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "Software Development",
    description: "Develop and maintain enterprise software applications.",
    salary: "$1800-2800/month"
  },
  {
    title: "Digital Marketing Intern",
    company: "GrowthMarketing Pro",
    location: "Remote",
    requiredSkills: ["Social Media", "Content Creation", "Analytics", "Communication"],
    experienceLevel: "Fresher",
    jobType: "Internship",
    careerTrack: "Content & Marketing",
    description: "Learn digital marketing strategies and help manage social media campaigns.",
    salary: "$350-600/month"
  },
  {
    title: "Mobile App Developer",
    company: "AppMakers Studio",
    location: "Dar es Salaam, Tanzania",
    requiredSkills: ["React Native", "JavaScript", "Mobile UI", "APIs"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "Mobile Development",
    description: "Build cross-platform mobile applications for various clients.",
    salary: "$1600-2600/month"
  },
  {
    title: "Python Developer Intern",
    company: "AI Solutions Africa",
    location: "Remote",
    requiredSkills: ["Python", "Django", "APIs", "Git"],
    experienceLevel: "Fresher",
    jobType: "Internship",
    careerTrack: "Software Development",
    description: "Work on backend development projects using Python and Django.",
    salary: "$500-800/month"
  },
  {
    title: "Graphic Designer",
    company: "Creative Studios",
    location: "Nairobi, Kenya",
    requiredSkills: ["Photoshop", "Illustrator", "Graphic Design", "Branding"],
    experienceLevel: "Junior",
    jobType: "Part-time",
    careerTrack: "Design",
    description: "Create visual content for marketing materials and brand identity.",
    salary: "$800-1400/month"
  },
  {
    title: "Customer Support Representative",
    company: "TechSupport Hub",
    location: "Remote",
    requiredSkills: ["Communication", "Problem Solving", "Customer Service", "Email Writing"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Customer Service",
    description: "Provide excellent customer support via email and chat.",
    salary: "$600-1000/month"
  },
  {
    title: "Junior DevOps Engineer",
    company: "CloudTech Systems",
    location: "Accra, Ghana",
    requiredSkills: ["Linux", "Docker", "AWS", "CI/CD", "Git"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "DevOps",
    description: "Help maintain and improve our cloud infrastructure and deployment pipelines.",
    salary: "$2000-3000/month"
  },
  {
    title: "Social Media Manager Intern",
    company: "BrandBoost Agency",
    location: "Remote",
    requiredSkills: ["Social Media", "Content Creation", "Canva", "Analytics"],
    experienceLevel: "Fresher",
    jobType: "Internship",
    careerTrack: "Content & Marketing",
    description: "Manage social media accounts and create engaging content.",
    salary: "$400-700/month"
  },
  {
    title: "QA Tester",
    company: "Quality Software Ltd",
    location: "Lagos, Nigeria",
    requiredSkills: ["Testing", "Bug Tracking", "Documentation", "Attention to Detail"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "Quality Assurance",
    description: "Test software applications and report bugs to ensure quality.",
    salary: "$800-1400/month"
  },
  {
    title: "WordPress Developer",
    company: "WebWorks Agency",
    location: "Remote",
    requiredSkills: ["WordPress", "PHP", "CSS", "HTML", "JavaScript"],
    experienceLevel: "Junior",
    jobType: "Freelance",
    careerTrack: "Web Development",
    description: "Build and customize WordPress websites for clients.",
    salary: "$1000-1800/month"
  },
  {
    title: "Business Analyst Intern",
    company: "Consulting Partners",
    location: "Nairobi, Kenya",
    requiredSkills: ["Excel", "Data Analysis", "Communication", "Problem Solving"],
    experienceLevel: "Fresher",
    jobType: "Internship",
    careerTrack: "Business Analysis",
    description: "Analyze business processes and support improvement initiatives.",
    salary: "$500-900/month"
  },
  {
    title: "Flutter Developer",
    company: "MobileFirst Solutions",
    location: "Remote",
    requiredSkills: ["Flutter", "Dart", "Mobile Development", "APIs"],
    experienceLevel: "Junior",
    jobType: "Full-time",
    careerTrack: "Mobile Development",
    description: "Develop beautiful mobile applications using Flutter framework.",
    salary: "$1700-2700/month"
  },
  {
    title: "SEO Specialist",
    company: "RankUp Digital",
    location: "Remote",
    requiredSkills: ["SEO", "Content Writing", "Analytics", "Keyword Research"],
    experienceLevel: "Junior",
    jobType: "Part-time",
    careerTrack: "Content & Marketing",
    description: "Optimize websites for search engines and improve organic rankings.",
    salary: "$900-1500/month"
  },
  {
    title: "IT Support Technician",
    company: "TechHelp Services",
    location: "Kampala, Uganda",
    requiredSkills: ["Hardware", "Windows", "Networking", "Troubleshooting"],
    experienceLevel: "Fresher",
    jobType: "Full-time",
    careerTrack: "IT Support",
    description: "Provide technical support and troubleshoot IT issues.",
    salary: "$700-1200/month"
  },
  {
    title: "Video Editor",
    company: "MediaPro Studios",
    location: "Remote",
    requiredSkills: ["Premiere Pro", "After Effects", "Video Editing", "Storytelling"],
    experienceLevel: "Junior",
    jobType: "Freelance",
    careerTrack: "Content & Marketing",
    description: "Edit videos for marketing campaigns and social media content.",
    salary: "$1000-1800/month"
  }
];

const learningResourcesData = [
  {
    title: "The Complete Web Development Bootcamp",
    platform: "Udemy",
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    relatedSkills: ["HTML", "CSS", "JavaScript", "Node.js", "React"],
    cost: "Paid",
    description: "Learn full-stack web development from scratch",
    duration: "65 hours",
    level: "Beginner"
  },
  {
    title: "CS50's Introduction to Computer Science",
    platform: "edX",
    url: "https://www.edx.org/course/cs50s-introduction-to-computer-science",
    relatedSkills: ["Programming", "Algorithms", "Problem Solving", "C", "Python"],
    cost: "Free",
    description: "Harvard's introduction to computer science and programming",
    duration: "12 weeks",
    level: "Beginner"
  },
  {
    title: "Google Data Analytics Professional Certificate",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    relatedSkills: ["Data Analysis", "Excel", "SQL", "Tableau", "R"],
    cost: "Paid",
    description: "Prepare for a career in data analytics",
    duration: "6 months",
    level: "Beginner"
  },
  {
    title: "Figma UI Design Tutorial",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
    relatedSkills: ["Figma", "UI Design", "Prototyping"],
    cost: "Free",
    description: "Complete Figma tutorial for beginners",
    duration: "2 hours",
    level: "Beginner"
  },
  {
    title: "Python for Everybody",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/python",
    relatedSkills: ["Python", "Programming", "Data Structures"],
    cost: "Free",
    description: "Learn Python programming from basics to data structures",
    duration: "8 months",
    level: "Beginner"
  },
  {
    title: "React - The Complete Guide",
    platform: "Udemy",
    url: "https://www.udemy.com/course/react-the-complete-guide/",
    relatedSkills: ["React", "JavaScript", "Redux", "Hooks"],
    cost: "Paid",
    description: "Master React including Hooks, Redux, and Next.js",
    duration: "49 hours",
    level: "Intermediate"
  },
  {
    title: "SEO Training Course",
    platform: "Moz",
    url: "https://moz.com/beginners-guide-to-seo",
    relatedSkills: ["SEO", "Content Marketing", "Keyword Research"],
    cost: "Free",
    description: "Beginner's guide to SEO by Moz",
    duration: "Self-paced",
    level: "Beginner"
  },
  {
    title: "SQL for Data Science",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/sql-for-data-science",
    relatedSkills: ["SQL", "Database", "Data Analysis"],
    cost: "Free",
    description: "Learn SQL for data science applications",
    duration: "4 weeks",
    level: "Beginner"
  },
  {
    title: "Digital Marketing Specialization",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/digital-marketing",
    relatedSkills: ["Digital Marketing", "Social Media", "Analytics", "SEO"],
    cost: "Paid",
    description: "Master digital marketing strategies",
    duration: "6 months",
    level: "Beginner"
  },
  {
    title: "Git and GitHub for Beginners",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    relatedSkills: ["Git", "GitHub", "Version Control"],
    cost: "Free",
    description: "Complete Git and GitHub tutorial",
    duration: "1 hour",
    level: "Beginner"
  },
  {
    title: "AWS Certified Cloud Practitioner",
    platform: "AWS Training",
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    relatedSkills: ["AWS", "Cloud Computing", "DevOps"],
    cost: "Free",
    description: "Learn AWS cloud fundamentals",
    duration: "Self-paced",
    level: "Beginner"
  },
  {
    title: "Flutter & Dart - Complete Guide",
    platform: "Udemy",
    url: "https://www.udemy.com/course/flutter-dart-the-complete-guide/",
    relatedSkills: ["Flutter", "Dart", "Mobile Development"],
    cost: "Paid",
    description: "Build iOS and Android apps with Flutter",
    duration: "42 hours",
    level: "Beginner"
  },
  {
    title: "Content Writing Masterclass",
    platform: "Udemy",
    url: "https://www.udemy.com/course/content-writing/",
    relatedSkills: ["Content Writing", "Copywriting", "SEO Writing"],
    cost: "Paid",
    description: "Learn professional content writing",
    duration: "8 hours",
    level: "Beginner"
  },
  {
    title: "Adobe Photoshop CC Tutorial",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=IyR_uYsRdPs",
    relatedSkills: ["Photoshop", "Graphic Design", "Photo Editing"],
    cost: "Free",
    description: "Complete Photoshop tutorial for beginners",
    duration: "3 hours",
    level: "Beginner"
  },
  {
    title: "Node.js - The Complete Guide",
    platform: "Udemy",
    url: "https://www.udemy.com/course/nodejs-the-complete-guide/",
    relatedSkills: ["Node.js", "Express", "MongoDB", "JavaScript"],
    cost: "Paid",
    description: "Master Node.js and build real applications",
    duration: "40 hours",
    level: "Intermediate"
  },
  {
    title: "Communication Skills Training",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/communication-skills",
    relatedSkills: ["Communication", "Presentation", "Public Speaking"],
    cost: "Free",
    description: "Improve your professional communication skills",
    duration: "4 weeks",
    level: "Beginner"
  },
  {
    title: "Docker and Kubernetes Complete Guide",
    platform: "Udemy",
    url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
    relatedSkills: ["Docker", "Kubernetes", "DevOps", "Containers"],
    cost: "Paid",
    description: "Master containerization and orchestration",
    duration: "22 hours",
    level: "Intermediate"
  },
  {
    title: "UI/UX Design Bootcamp",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    relatedSkills: ["UX Design", "User Research", "Wireframing", "Prototyping"],
    cost: "Paid",
    description: "Google UX Design Professional Certificate",
    duration: "6 months",
    level: "Beginner"
  },
  {
    title: "Excel Skills for Business",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/excel",
    relatedSkills: ["Excel", "Data Analysis", "Spreadsheets"],
    cost: "Free",
    description: "Master Excel for business applications",
    duration: "6 months",
    level: "Beginner"
  },
  {
    title: "Machine Learning Crash Course",
    platform: "Google",
    url: "https://developers.google.com/machine-learning/crash-course",
    relatedSkills: ["Machine Learning", "Python", "TensorFlow"],
    cost: "Free",
    description: "Google's fast-paced ML introduction",
    duration: "15 hours",
    level: "Intermediate"
  }
];

export { jobsData, learningResourcesData };
