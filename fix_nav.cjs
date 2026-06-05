const fs = require('fs');

const htmlFiles = [
  'index.html',
  'info.html',
  'location.html',
  'my-partners.html',
  'plus.html',
  'privacy-policy.html',
  'profile.html',
  'register-company.html',
  'register-user.html',
  'signin.html',
  'supplier-standards.html',
  'terms-of-service.html'
];

const exactNavbarHTML = `  <header class="navbar">
    <a href="/" class="navbar-logo-wrapper">
      <img
        src="https://res.cloudinary.com/duh9wvgzu/image/upload/q_auto/f_auto/v1780501537/IMG_5442_r9v9ez.jpg"
        alt="GrabRaw Logo"
        class="navbar-logo-image"
        loading="lazy"
      />
      <span class="navbar-logo-text">GrabRaw</span>
    </a>
    <nav class="nav-links">
      <a href="/#categories" class="nav-link">Material</a>
      <a href="/#suppliers" class="nav-link">Suppliers</a>
      <a href="/plus.html" class="nav-link">GrabRaw +</a>
      <a href="/#ask-ai" class="nav-link">Ask AI</a>
      <hr class="mobile-nav-divider" style="display: none" />
      <a
        href="/signin.html"
        class="nav-link mobile-nav-signin"
        style="display: none"
        >Sign In</a
      >
      <a
        href="/register-user.html"
        class="btn mobile-nav-getstarted"
        style="display: none"
        aria-label="Get Started"
        >Get Started</a
      >
    </nav>
    <div class="nav-actions">
      <div id="unauthNav">
        <a href="/signin.html" class="btn btn-outline" style="border-radius: 100px">Sign In</a>
        <a href="/register-user.html" class="btn btn-primary" style="border-radius: 100px">Get Started</a>
      </div>
      <div id="authNav" style="display: none; position: relative;">
        <button id="account-btn" class="btn btn-outline" style="border-radius: 100px; display: inline-flex; align-items: center;" onclick="toggleDropdown()">
          My Account
          <span id="nav-avatar" style="
            display:inline-flex;align-items:center;
            justify-content:center;width:24px;height:24px;
            border-radius:50%;background:#4285F4;
            color:white;font-size:11px;font-weight:600;
            margin-left:8px;overflow:hidden;"></span>
        </button>
        <div id="accountDropdown" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); width: 220px; z-index: 10000; overflow: hidden; padding: 12px 0; text-align: left; opacity: 1;">
          <div class="dropdown-header" style="padding: 12px 16px;">
            <span class="dropdown-label" style="display:block; font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">SIGNED IN AS</span>
            <span id="dropdownEmail" style="display:block; font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"></span>
          </div>
          <hr style="margin: 4px 0; border: none; border-top: 1px solid #e0e0e0;">
          <a href="/profile.html" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">Profile</a>
          <a href="/location.html" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">My Location</a>
          <a href="/my-partners.html" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">My Partner</a>
          <a href="/register-company.html" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">Register Company</a>
          <hr style="margin: 4px 0; border: none; border-top: 1px solid #e0e0e0;">
          <a id="signOutBtn" style="padding: 8px 16px; display: block; color: red; font-weight: 600; cursor: pointer; text-decoration: none;">Sign Out</a>
        </div>
      </div>
    </div>
  </header>`;

const exactAuthJS = `async function initAuth() {
        const { data: { session } } = await sb.auth.getSession();
        if (session) { 
          await updateNavbar(session.user); 
        } else {
          showLoggedOutNavbar();
        }

        sb.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              await updateNavbar(session.user);
            } else {
              showLoggedOutNavbar();
            }
          }
        );
      }

      async function updateNavbar(user) {
        let plan = 'free';
        try {
          const { data } = await sb
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();
          if (data && data.plan) { plan = data.plan; }
        } catch(e) {}
        
        window.userPlan = plan;
        window.GRABRAW_IS_PLUS = plan.includes('+') || plan.toLowerCase().includes('plus');
        window.userSession = user;
        
        const unauthNav = document.getElementById('unauthNav');
        const authNav = document.getElementById('authNav');
        const dropdownEmail = document.getElementById('dropdownEmail');
        
        if (unauthNav) unauthNav.style.display = 'none';
        if (authNav) authNav.style.display = 'block';
        if (dropdownEmail) dropdownEmail.textContent = user.email;

        // Avatar logic
        const navAvatar = document.getElementById('nav-avatar');
        if (navAvatar) {
            let avatarUrl = '';
            try {
                const { data } = await sb.from('profiles').select('avatar_url').eq('id', user.id).single();
                if (data && data.avatar_url) avatarUrl = data.avatar_url;
            } catch(e) {}
            
            if (avatarUrl) {
                navAvatar.innerHTML = '<img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
            } else {
                navAvatar.textContent = user.email ? user.email.charAt(0).toUpperCase() : '?';
            }
        }
      }

      function showLoggedOutNavbar() {
        window.userPlan = 'free';
        window.GRABRAW_IS_PLUS = false;
        window.userSession = null;
        
        const unauthNav = document.getElementById('unauthNav');
        const authNav = document.getElementById('authNav');
        if (unauthNav) unauthNav.style.display = 'block';
        if (authNav) authNav.style.display = 'none';
      }

      function toggleDropdown() {
        const d = document.getElementById('accountDropdown');
        if (d) d.style.display = d.style.display === 'block' ? 'none' : 'block';
      }

      document.addEventListener('click', (e) => {
          if (!e.target.closest('#account-btn') && !e.target.closest('#accountDropdown')) {
              const d = document.getElementById('accountDropdown');
              if (d) d.style.display = 'none';
          }
      });`;

for (const file of htmlFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace Navbar
  content = content.replace(/<header class="navbar">.*?<\/header>/s, exactNavbarHTML);

  const authJsRegex = /async function initAuth\(\)\s*\{[\s\S]*?function showLoggedOutNavbar\(\)\s*\{[\s\S]*?(?=\n\s*(?:window\.|function|async|document\.|initAuth|var|let|const|\/\/|})|$)(?:\s*function toggleDropdown\(\)\s*\{.*?(?=\n\s*(?:window\.|function|async|document\.|initAuth|var|let|const|\/\/|}))*)?/s;

  const authJsOriginalMatch = content.match(authJsRegex);
  if (authJsOriginalMatch) {
      content = content.replace(authJsRegex, exactAuthJS);
  }

  const DOMContentLoadedSignoutRegex = /if\s*\(signOutBtn\)\s*\{\s*signOutBtn.addEventListener\('click'[\s\S]*?\}\);/s;
  if (!content.match(DOMContentLoadedSignoutRegex)) {
      content = content.replace(/initAuth\(\);/, `initAuth();\n\n      document.addEventListener('DOMContentLoaded', () => {\n        const signOutBtn = document.getElementById('signOutBtn');\n        if (signOutBtn) {\n          signOutBtn.addEventListener('click', async (e) => {\n            e.preventDefault();\n            await sb.auth.signOut();\n            window.location.reload();\n          });\n        }\n      });`);
  }
  
  content = content.replace(/if\s*\(accountBtn\s*&&\s*accountDropdown\)\s*\{[\s\S]*?\}\s*document\.addEventListener\('click',\s*\(e\)\s*=>\s*\{[\s\S]*?\}\);/s, '');
  content = content.replace(/const accountBtn = document\.getElementById\('account-btn'\);\s*const accountDropdown = document\.getElementById\('accountDropdown'\);/, '');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Navbar fixes complete');
