const fs = require('fs');
let html = fs.readFileSync('info.html', 'utf8');

// The current user structure was overwritten. So I must replace the `<div class="nav-actions"> ... </div>` completely.
// Let's replace the whole nav-actions block.
const navActionsRegex = /<div class="nav-actions">.*?<\/header>/s;

const newNavActions = `<div class="nav-actions">
        <button id="account-btn" class="btn btn-primary" 
          style="display:none" 
          onclick="toggleDropdown()">
          My Account
          <span id="nav-avatar" style="
            display:inline-flex;align-items:center;
            justify-content:center;width:32px;height:32px;
            border-radius:50%;background:#4285F4;
            color:white;font-size:13px;font-weight:600;
            margin-left:8px;overflow:hidden;"></span>
        </button>
        <a href="/signin.html" id="signin-btn" 
          class="btn btn-primary">Sign In</a>

        <div id="accountDropdown" style="display: none; position: absolute; right: 24px; top: 60px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); width: 220px; z-index: 10000; overflow: hidden; padding: 12px 0; text-align: left;">
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
  </header>`;

html = html.replace(navActionsRegex, newNavActions);

// Update Auth Script
const updateNavbarRegex = /async function updateNavbar\(user\)\s*\{[\s\S]*?(?=async function checkAuthThenNavigate|document\.addEventListener\('DOMContentLoaded')/s;

const newUpdateNavbar = `async function updateNavbar(user) {
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
        
        const signinBtn = document.getElementById('signin-btn');
        const accountBtn = document.getElementById('account-btn');
        const dropdownEmail = document.getElementById('dropdownEmail');
        const navAvatar = document.getElementById('nav-avatar');
        
        if (signinBtn) signinBtn.style.display = 'none';
        if (accountBtn) accountBtn.style.display = 'flex';
        
        if (navAvatar) {
            let avatarUrl = '';
            try {
                const { data } = await sb.from('profiles').select('avatar_url').eq('id', user.id).single();
                if (data && data.avatar_url) avatarUrl = data.avatar_url;
            } catch(e) {}
            
            if (avatarUrl) {
                navAvatar.innerHTML = \`<img src="\${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">\`;
            } else {
                navAvatar.textContent = user.email ? user.email.charAt(0).toUpperCase() : '?';
            }
        }
        
        if (dropdownEmail) dropdownEmail.textContent = user.email;
        
        if (plan === 'plus' || plan === 'GrabRaw+') {
            // Shows plus badge if plan === 'plus'
            if (accountBtn && !document.getElementById('plus-badge')) {
                const badge = document.createElement('span');
                badge.id = 'plus-badge';
                badge.textContent = 'PLUS';
                badge.style.cssText = 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: 8px; letter-spacing: 0.5px;';
                accountBtn.appendChild(badge);
            }
        }
      }
      
      function toggleDropdown() {
        const d = document.getElementById('accountDropdown');
        d.style.display = d.style.display === 'block' ? 'none' : 'block';
      }
      
      document.addEventListener('click', function(e) {
        if (!e.target.closest('#account-btn')) {
          const d = document.getElementById('accountDropdown');
          if (d) d.style.display = 'none';
        }
      });
      
      `;

html = html.replace(updateNavbarRegex, newUpdateNavbar);


// Fix showLoggedOutNavbar as well, since unauthNav / authNav IDs no longer exist but signinBtn / accountBtn do.
const showLoggedOutNavbarRegex = /function showLoggedOutNavbar\(\)\s*\{[\s\S]*?(?=\})/s;
const newShowLoggedOutNavbar = `function showLoggedOutNavbar() {
        window.userSession = null;
        window.userPlan = 'free';
        window.GRABRAW_IS_PLUS = false;
        const signinBtn = document.getElementById('signin-btn');
        const accountBtn = document.getElementById('account-btn');
        if (signinBtn) signinBtn.style.display = 'flex';
        if (accountBtn) accountBtn.style.display = 'none';
      `;

html = html.replace(showLoggedOutNavbarRegex, newShowLoggedOutNavbar);

fs.writeFileSync('info.html', html, 'utf8');
console.log('Fixed info.html');
