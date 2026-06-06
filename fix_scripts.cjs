const fs = require('fs');

const files = ['signin.html', 'register-user.html', 'plus.html'];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');

  // Step 1: Remove the specific createClient and initAuth lines
  html = html.replace(/const\s*{\s*createClient\s*}\s*=\s*supabase;/g, '');
  html = html.replace(/const\s+sb\s*=\s*createClient\([\s\S]*?\);/g, 'const sb = window.sb;');
  html = html.replace(/initAuth\(sb\);/g, '');
  
  // Also fix any place where const sb = window.sb; is duplicated or replace if needed
  // Clean up multiple const sb = window.sb; into let sb = window.sb; or just keep one. Actually, const sb = window.sb; inside <script> is fine if it's the top level or within scope.
  // We'll replace `const sb = window.sb;` and then replace `<script type="module" src="/src/auth.js"></script>` with the 2 lines.

  // Let's replace any existing imports
  html = html.replace(/<script src="https:\/\/cdn.jsdelivr.net\/npm\/@supabase\/supabase-js@2"><\/script>/g, '');
  html = html.replace(/<script type="module" src="\/src\/auth\.js"><\/script>/g, '');
  html = html.replace(/<script src="\/auth-global\.js"><\/script>/g, '');
  
  // Inject the required scripts just before the <script> where we use `sb = window.sb;`
  html = html.replace(/<script>\s*\/\/\s*Supabase credentials/g, `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/auth-global.js"></script>
<script>
    // Supabase credentials`);

  // Wait, some files might not have `// Supabase credentials`.
  
  fs.writeFileSync(file, html, 'utf8');
}
console.log('Fixed signin, register, plus');
