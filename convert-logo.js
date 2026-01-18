const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'public', 'logo.png');
const imageBuffer = fs.readFileSync(logoPath);
const base64Image = imageBuffer.toString('base64');

console.log('Base64 length:', base64Image.length);
console.log('\nFull Base64 string:');
console.log(base64Image);

// Write to file for easy copying
fs.writeFileSync('logo-base64.txt', base64Image);
console.log('\n✅ Saved to logo-base64.txt');
