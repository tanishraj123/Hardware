import fs from 'fs';
import path from 'path';

const files = ['index.html', 'info.html', 'location.html', 'my-partners.html', 'profile.html', 'plus.html'];

for (const file of files) {
  let p = path.join(process.cwd(), file);
  if (!fs.existsSync(p)) continue;

  let content = fs.readFileSync(p, 'utf8');

  // STEP 2: Replace nav block
  // Finding <header class="navbar"> ... </header>
  const headerRegex = /<header\s+class=["']navbar["']>[\s\S]*?<\/header>/;
  content = content.replace(headerRegex, '<div id="navbar-placeholder"></div>');

  // STEP 3: Add <script src="/navbar.js"></script> after supabase script tag
  const supabaseRegex = /(<script[^>]*src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2["'][^>]*><\/script>)/;
  if(supabaseRegex.test(content)) {
    content = content.replace(supabaseRegex, '$1\n  <script src="/navbar.js"></script>');
  } else {
    // fallback if not found
    content = content.replace('</head>', '  <script src="/navbar.js"></script>\n</head>');
  }

  // STEP 4: Add loadNavbar() at the start of the bottom script
  // Finding <script> tag that is specifically at the bottom, e.g. after the footer, or the script defining "const { createClient } = supabase"
  // Since we know they all have const { createClient } = supabase; inside a script (in plus.html it's at bottom too, 1993:  <script>)
  
  // Let's find the last <script> that contains const { createClient } = supabase;
  const lastScriptRegex = /(<script>)\s*(const \{ createClient \} = supabase;)/g;
  
  // Actually, we want to replace the last occurrence or just the occurrence that defines the bottom logic. 
  // Let's replace ALL of them just in case, but plus.html has two.
  const regexList = Array.from(content.matchAll(lastScriptRegex));
  if (regexList.length > 0) {
    const match = regexList[regexList.length - 1]; // get the last one
    
    const before = content.substring(0, match.index);
    const middle = `<script>\n      loadNavbar();\n      const { createClient } = supabase;`;
    const after = content.substring(match.index + match[0].length);
    content = before + middle + after;
  } else {
    // If we didn't find "const { createClient } = supabase;", just put it before the closing </body>
    content = content.replace(/<\/body>/, '<script>\nloadNavbar();\n</script>\n</body>');
  }

  fs.writeFileSync(p, content);
  console.log(`Updated ${file}`);
}
