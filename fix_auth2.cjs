const fs = require('fs');

const files = ['signin.html', 'register-user.html', 'plus.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace createClient logic at the top
  content = content.replace(/const\s*{\s*createClient\s*}\s*=\s*supabase;/g, '');
  content = content.replace(/const\s+sb\s*=\s*createClient\([^)]*\);/g, 'const sb = window.sb;');
  content = content.replace(/initAuth\(sb\);/g, '');

  content = content.replace(/<script type="module" src="\/src\/auth\.js"><\/script>/g, '<script src="/auth-global.js"></script>');
  // plus.html already has global script, register-user and signin might not

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed auth credentials in signin, register, plus');
