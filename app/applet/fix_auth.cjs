const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'signin.html' && f !== 'register-user.html' && f !== 'signup.html');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if we already added it
  if (!content.includes('<script src="/auth-global.js"></script>')) {
    // Insert after supabase script
    content = content.replace(
      /<script src="https:\/\/cdn.jsdelivr.net\/npm\/@supabase\/supabase-js@2"><\/script>/,
      '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n  <script src="/auth-global.js"></script>'
    );
  }

  // Replace auth init with const sb = window.sb
  const initRegex = /const\s+\{\s*createClient\s*\}\s*=\s*supabase;\s*const\s+sb\s*=\s*createClient\([\s\S]*?\);/g;
  content = content.replace(initRegex, 'const sb = window.sb;');

  // Remove `async function initAuth() { ... }` or similar
  content = content.replace(/async function initAuth\(\)\s*\{[\s\S]*?sb\.auth\.onAuthStateChange\([\s\S]*?\}\s*\);\s*\}/g, '');
  content = content.replace(/initAuth\(\);/g, '');

  content = content.replace(/async function updateNavbar\(user\)\s*\{[\s\S]*?function showLoggedOutNavbar\(\)\s*\{[\s\S]*?\}/, '');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done mapping auth.');

