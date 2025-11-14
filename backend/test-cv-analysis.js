import axios from 'axios';

// Test CV text
const testCVText = `
John Doe
Senior Software Engineer
Email: john.doe@email.com
Phone: +1-234-567-8900
Address: New York, NY

PROFESSIONAL SUMMARY
Experienced software engineer with 5 years of experience in full-stack web development. 
Skilled in JavaScript, React, Node.js, and Python. Passionate about creating scalable 
applications and mentoring junior developers.

WORK EXPERIENCE
Senior Software Engineer | TechCorp Inc | 2021 - Present
• Led development of microservices architecture using Node.js and Docker
• Implemented React-based dashboard increasing user engagement by 40%
• Mentored team of 3 junior developers

Software Engineer | StartupXYZ | 2019 - 2021  
• Developed REST APIs using Python and Flask
• Built responsive web applications with React and TypeScript
• Collaborated with cross-functional teams using Agile methodology

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, TypeScript, Java
Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js, Flask, Django
Databases: MySQL, PostgreSQL, MongoDB
Tools: Docker, Git, AWS, Jenkins

PROJECTS
E-Commerce Platform | 2022
Built a full-stack e-commerce platform using React and Node.js
Implemented payment gateway integration and user authentication

Task Management App | 2021
Created a collaborative task management application
Features include real-time updates, file sharing, and team collaboration

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2015 - 2019
Relevant Coursework: Data Structures, Algorithms, Software Engineering
GPA: 3.8/4.0
`;

const testCVAnalysis = async () => {
  try {
    console.log('🧪 Testing CV Analysis...\n');
    
    // You would need a valid JWT token for this to work
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual token
    
    const response = await axios.post('http://localhost:5001/api/cv-analysis/analyze-text', {
      cvText: testCVText
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ CV Analysis successful!');
    console.log('\n📊 Profile Analysis Results:');
    
    const profile = response.data.profile;
    
    // Parse the JSON fields to get counts
    const parseJSONField = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          let parsed = JSON.parse(field);
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    };

    const skillsCount = parseJSONField(profile.skills)?.length || 0;
    const workExpCount = parseJSONField(profile.workExperience)?.length || 0;
    const projectsCount = parseJSONField(profile.projects)?.length || 0;
    const educationCount = parseJSONField(profile.education)?.length || 0;

    console.log(`🚀 Skills Mastered: ${skillsCount}`);
    console.log(`💼 Work Experience: ${workExpCount}`);  
    console.log(`📁 Projects: ${projectsCount}`);
    console.log(`🎓 Education: ${educationCount}`);

    console.log('\n📋 Extracted Skills:');
    const skills = parseJSONField(profile.skills);
    if (skills.length > 0) {
      skills.forEach((skill, index) => {
        console.log(`  ${index + 1}. ${skill}`);
      });
    } else {
      console.log('  No skills extracted');
    }

    console.log('\n💼 Work Experience Details:');
    const workExp = parseJSONField(profile.workExperience);
    if (workExp.length > 0) {
      workExp.forEach((exp, index) => {
        console.log(`  ${index + 1}. ${exp.position} at ${exp.company} (${exp.period})`);
      });
    } else {
      console.log('  No work experience extracted');
    }

  } catch (error) {
    console.error('❌ CV Analysis failed:', error.response?.data || error.message);
    console.log('\n📝 Note: Make sure you have a valid JWT token and the server is running');
  }
};

console.log(`
🔧 CV Analysis Fix Test
========================

This test demonstrates the fix for the CV analysis issue where 
incorrect numbers (1719, 806, 145) were being displayed instead 
of actual counts.

The fix includes:
1. Proper JSON parsing in the frontend
2. Skills extraction in CV analysis  
3. Accurate counting of profile sections

To run this test:
1. Login to get a JWT token
2. Replace the authToken variable with your actual token
3. Run: node test-cv-analysis.js
`);

// Uncomment the line below to run the test (after adding a valid token)
// testCVAnalysis();
