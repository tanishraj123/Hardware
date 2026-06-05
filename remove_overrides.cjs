const fs = require('fs');

const files = [
  'index.html',
  'my-partners.html',
  'plus.html',
  'register-user.html',
  'signin.html',
  'supplier-standards.html',
  'terms-of-service.html',
  'info.html',
  'location.html',
  'profile.html',
  'register-company.html'
];
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');

  // Let's find "const email = user.email || '';" and erase down to the end of the escape key listener
  const startStr = "const navActions = document.querySelector('.nav-actions');";
  const endStr = "if (dropdown) dropdown.classList.remove('active');\n              }\n            })";
  const endStr2 = "if (dropdown) dropdown.classList.remove('active');\n            }\n          })";

  if (text.includes("navActions.innerHTML = `")) {
     // Regex to clean it
     const regex = /const navActions = document\.querySelector\('\.nav-actions'\);[\s\S]*?navActions\.innerHTML\s*=\s*`[\s\S]*?document\.addEventListener\('keydown',\s*function\(e\)\s*\{[\s\S]*?\}\s*\)/s;
     if (text.match(regex)) {
        text = text.replace(regex, '');
        fs.writeFileSync(file, text);
        console.log('Removed successfully in ' + file);
     } else {
        const regex3 = /if\s*\(navActions\)\s*\{[\s\S]*?navActions\.innerHTML\s*=\s*`[\s\S]*?document\.addEventListener\('keydown',\s*function\(e\)\s*\{[\s\S]*?\}\s*\)\s*\}/s;
        if (text.match(regex3)) {
           text = text.replace(regex3, '');
           fs.writeFileSync(file, text);
           console.log('Removed successfully (fallback) in ' + file);
        } else {
           console.log('Failed to match in ' + file);
        }
     }
  }
}
