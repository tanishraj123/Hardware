const fs = require('fs');
let html = fs.readFileSync('info.html', 'utf8');

html = html.replace('value="iPhone 15"', 'value=""');
html = html.replace("const initialQuery = urlParams.get('q') || (searchInput && searchInput.value.trim());", "const initialQuery = urlParams.get('q') || '';");

fs.writeFileSync('info.html', html, 'utf8');
console.log('Replaced');
