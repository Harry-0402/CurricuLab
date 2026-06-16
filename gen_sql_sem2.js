const fs = require('fs');

const subjects = ['pba204', 'pba205', 'pba206', 'pba207', 'pba208', 'pba211', 'pba212', 'pba213'];
const titles = {
  pba204: 'Production and Operations Management',
  pba205: 'Digital Transformation',
  pba206: 'Legal Aspects of Business',
  pba207: 'Visualization and Storytelling',
  pba208: 'Business Research Methods',
  pba211: 'Data Analysis Using Python',
  pba212: 'Data Analysis Using Powerbi',
  pba213: 'Business Communication - II'
};

let sql = '-- Insert BOTH Study Notes and Revision Notes for Sem-2\n';
sql += '-- This script restores both types of notes if they were deleted.\n\n';

subjects.forEach(sub => {
  const title = titles[sub];
  const urlTitle = encodeURIComponent(sub.toUpperCase() + ' ' + title).replace(/%20/g, '%20');
  for (let i = 1; i <= 5; i++) {
    // Study Notes
    const linkStudy = `https://curriculab-resources.netlify.app/Sem-2/${urlTitle}/${sub.toUpperCase()}%20Unit-${i}%20Notes.html`;
    sql += `INSERT INTO vault_resources (subject_id, unit_id, type, title, link) VALUES ('${sub}', 'unit-${i}', 'study_note', 'Unit ${i}: ${title}', '${linkStudy}');\n`;
    
    // Revision Notes
    const linkRev = `https://curriculab-resources.netlify.app/Sem-2/${urlTitle}/${sub.toUpperCase()}%20Unit-${i}%20Revision%20Notes.html`;
    sql += `INSERT INTO vault_resources (subject_id, unit_id, type, title, link) VALUES ('${sub}', 'unit-${i}', 'revision_note', 'Unit ${i} Revision Notes', '${linkRev}');\n`;
  }
  sql += '\n';
});

fs.writeFileSync('sql-files/update_sem2_vault.sql', sql);
console.log('SQL script updated!');
