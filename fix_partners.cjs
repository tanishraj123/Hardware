const fs = require('fs');
let html = fs.readFileSync('my-partners.html', 'utf8');

const regex = /document\.addEventListener\('DOMContentLoaded', async \(\) => \{\s*\/\/ Load Suppliers initially\s*renderSavedSuppliers\(\);/s;

html = html.replace(regex, `document.addEventListener('DOMContentLoaded', async () => {
      // Listen for auth-changed event to render suppliers
      window.addEventListener('auth-changed', (e) => {
         renderSavedSuppliers();
      });`);
      
// Wait, the prompt says "Do NOT touch signin.html or signup.html...".
// Remove the inner user check logic from `my-partners.html`.
const regex2 = /\/\/ Check User Auth[\s\S]*?currentUser = user;\n\s*\}/s;
html = html.replace(regex2, '');

fs.writeFileSync('my-partners.html', html, 'utf8');
