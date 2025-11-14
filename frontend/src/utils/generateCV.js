import jsPDF from 'jspdf';

export const generateCV = (profileData) => {
  const doc = new jsPDF();
  
  // Helper function to parse JSON fields that might be strings (handles double-encoded JSON)
  const parseJSONField = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string' && field.trim() !== '') {
      try {
        // First parse - might return a string or array
        let parsed = JSON.parse(field);
        // If still a string, try parsing again (double-encoded case)
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
  
  // Parse JSON string fields from database
  const workExperience = parseJSONField(profileData?.workExperience);
  const projects = parseJSONField(profileData?.projects);
  const education = parseJSONField(profileData?.education);
  
  // Use actual profile data or fallback to dummy data for missing fields
  const cvData = {
    fullName: profileData?.fullName?.toUpperCase() || "YOUR NAME",
    address: profileData?.address || "Your Address",
    phone: profileData?.phone || "Your Phone",
    email: profileData?.email || "your.email@example.com",
    website: profileData?.website || "www.yourwebsite.com",
    
    summary: profileData?.summary || profileData?.cvText || "Professional summary goes here. Update your profile to add your summary.",
    
    experience: workExperience.length > 0
      ? workExperience
      : [
          {
            position: "Your Position",
            company: "Company Name",
            period: "Start - End",
            responsibilities: ["Add your work experience in the profile section"]
          }
        ],
    
    projects: projects.length > 0
      ? projects
      : profileData?.projectDescriptions 
        ? [{ name: "Projects", period: "", achievements: [profileData.projectDescriptions] }]
        : [
            {
              name: "Your Project",
              period: "Year",
              achievements: ["Add your projects in the profile section"]
            }
          ],
    
    education: education.length > 0
      ? education
      : [
          {
            degree: profileData?.educationLevel || "Your Degree",
            school: profileData?.department || "Your School/Department",
            period: "Start - End"
          }
        ],
    
    skills: profileData?.skills && Array.isArray(profileData.skills) && profileData.skills.length > 0
      ? profileData.skills.map(skill => typeof skill === 'string' ? skill : skill.skillName)
      : ["Add your skills in the profile section"]
  };
  
  // Colors matching the image
  const purpleColor = [130, 94, 189]; // Purple for headers
  const darkGray = [51, 51, 51];
  const mediumGray = [85, 85, 85];
  const lightGray = [200, 200, 200];
  
  let yPos = 30;
  
  // ========== HEADER SECTION (White background) ==========
  // Name in purple, centered
  doc.setTextColor(...purpleColor);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(cvData.fullName, 105, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Contact information - first line
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  const contactLine1 = `${cvData.address} • ${cvData.phone} • ${cvData.email}`;
  doc.text(contactLine1, 105, yPos, { align: 'center' });
  
  yPos += 5;
  
  // Website
  doc.text(cvData.website, 105, yPos, { align: 'center' });
  
  yPos += 10;
  
  // ========== SUMMARY SECTION ==========
  doc.setTextColor(...purpleColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SUMMARY", 20, yPos);
  
  // Underline for section header
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  const summaryLines = doc.splitTextToSize(cvData.summary, 170);
  doc.text(summaryLines, 20, yPos);
  yPos += summaryLines.length * 5 + 10;
  
  // ========== WORK EXPERIENCE SECTION ==========
  doc.setTextColor(...purpleColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("WORK EXPERIENCE", 20, yPos);
  
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  yPos += 10;
  
  cvData.experience.forEach((job, index) => {
    // Check if we need a new page before adding job entry
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Position title and company
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text(`${job.position} , ${job.company}`, 20, yPos);
    
    // Period (right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(job.period, 190, yPos, { align: 'right' });
    
    yPos += 7;
    
    // Responsibilities as bullet points
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    job.responsibilities.forEach((resp) => {
      if (yPos > 265) {
        doc.addPage();
        yPos = 20;
      }
      const bullet = "•";
      doc.text(bullet, 23, yPos);
      const respLines = doc.splitTextToSize(resp, 162);
      doc.text(respLines, 28, yPos);
      yPos += respLines.length * 5 + 1;
    });
    
    yPos += 5;
  });
  
  // ========== PROJECTS SECTION ==========
  doc.setTextColor(...purpleColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECTS", 20, yPos);
  
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  yPos += 10;
  
  cvData.projects.forEach((project, index) => {
    // Check if we need a new page before adding project
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Project name
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text(project.name, 20, yPos);
    
    // Period (right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(project.period, 190, yPos, { align: 'right' });
    
    yPos += 7;
    
    // Project achievements/description as bullet points
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const achievements = project.achievements || (project.description ? [project.description] : []);
    achievements.forEach((achievement) => {
      if (yPos > 265) {
        doc.addPage();
        yPos = 20;
      }
      const bullet = "•";
      doc.text(bullet, 23, yPos);
      const achievementLines = doc.splitTextToSize(achievement, 162);
      doc.text(achievementLines, 28, yPos);
      yPos += achievementLines.length * 5 + 1;
    });
    
    yPos += 5;
  });
  
  // ========== EDUCATION SECTION ==========
  // Check if education section fits on current page
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setTextColor(...purpleColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("EDUCATION", 20, yPos);
  
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  yPos += 10;
  
  cvData.education.forEach((edu, index) => {
    // Check if we need a new page for this education entry
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    // Degree
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text(edu.degree, 20, yPos);
    
    // Period (right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(edu.period, 190, yPos, { align: 'right' });
    
    yPos += 6;
    
    // School
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(edu.school, 20, yPos);
    
    yPos += 8;
  });
  
  // ========== SKILLS SECTION ==========
  // Check if skills section fits on current page
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 5;
  }
  
  doc.setTextColor(...purpleColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SKILLS", 20, yPos);
  
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  yPos += 10;
  
  // Display skills in two columns
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  
  const skillsPerColumn = Math.ceil(cvData.skills.length / 2);
  const leftColumnSkills = cvData.skills.slice(0, skillsPerColumn);
  const rightColumnSkills = cvData.skills.slice(skillsPerColumn);
  
  // Left column
  leftColumnSkills.forEach((skill, index) => {
    doc.text(`• ${skill}`, 20, yPos + (index * 6));
  });
  
  // Right column
  rightColumnSkills.forEach((skill, index) => {
    doc.text(`• ${skill}`, 110, yPos + (index * 6));
  });
  
  // Save the PDF
  doc.save('my_cv.pdf');
};
