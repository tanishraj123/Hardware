const fs = require('fs');
let text = fs.readFileSync('info.html', 'utf8');

const regex = /<div class="material-list">[\s\S]*?<\/div>\n\s*<!-- PDF Download Button -->/;
const replacement = `<div class="material-list"></div>

      <!-- PDF Download Button -->`;

if (regex.test(text)) {
  text = text.replace(regex, replacement);
  fs.writeFileSync('info.html', text, 'utf8');
  console.log("Success");
} else {
  console.log("Regex not found!");
}
