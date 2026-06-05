const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix auth.js
  content = content.replace(/<script src="\/src\/auth\.js"><\/script>/g, '<script type="module" src="/src/auth.js"></script>');
  content = content.replace(/<script src="\/src\/auth\.js" defer><\/script>/g, '<script type="module" src="/src/auth.js" defer></script>');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed auth module tags.');
