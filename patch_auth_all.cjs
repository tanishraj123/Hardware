const fs = require('fs');

const globalScript = `
<script>
(function() {
  if (typeof sb === 'undefined') return;

  async function updateNavigationUI(user) {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    let isPlus = false;
    if (window.GRABRAW_IS_PLUS !== undefined) {
      isPlus = window.GRABRAW_IS_PLUS;
    } else {
      try {
        const { data } = await sb.from('profiles').select('plan').eq('id', user.id).single();
        if (data && typeof data.plan === 'string' && (data.plan.includes('+') || data.plan.toLowerCase().includes('plus'))) {
          isPlus = true;
        }
      } catch(e) {}
      window.GRABRAW_IS_PLUS = isPlus;
    }

    const email = user.email || '';
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const avatar = user.user_metadata?.avatar_url;

    const badgeHtml = isPlus ? '<div class="avatar-badge plus-badge" title="GrabRaw+ Member" style="position: absolute; bottom: -2px; right: -2px; font-size: 10px; background: #FFD700; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border: 2px solid white; z-index: 2;">✦</div>' : '';

    navActions.innerHTML = \`<div class="user-profile-menu-container" style="position: relative;">
      <button id="account-btn" class="btn" style="border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 16px; cursor: pointer; transition: all 0.2s ease; height: 40px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); text-decoration: none;">
        <span style="font-size: 14px; font-weight: 600;">My Account</span>
        <div class="avatar-wrapper" style="position: relative; display: flex; align-items: center; justify-content: center;">
          \${avatar ? \\\`<img src="\${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; display: block;" alt="Avatar" />\\\` : \\\`<div style="background-color: #4285F4; color: #ffffff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; text-transform: uppercase;">\${initial}</div>\\\`}\${badgeHtml}
        </div>
      </button>
      <div id="account-dropdown" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 220px; min-width: 200px; z-index: 1000; overflow: hidden; padding: 12px 0; text-align: left;">
        <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; margin-bottom: 4px; pointer-events: none; user-select: text;">
          <div style="font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Signed in as</div>
          <div style="display: flex; align-items: center;">
             <span style="font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="\${email}">\${email}</span>
             \${isPlus ? '<span class="plus-badge" style="margin-left: 6px; flex-shrink: 0; position: static; box-shadow: none; border: none; font-size: 12px; width: auto; height: auto; background: none; color: #4285F4;" title="GrabRaw+ Member">✦</span>' : ''}
          </div>
          \${isPlus ? '<div style="font-size: 11px; font-weight: 600; color: #4285F4; margin-top: 4px;">⭐ GrabRaw+ Member</div>' : ''}
        </div>
        <a href="profile.html" class="dropdown-item" style="display: block; padding: 10px 16px; color: #3c4043; text-decoration: none; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">Profile</a>
        <a href="location.html" class="dropdown-item" style="display: block; padding: 10px 16px; color: #3c4043; text-decoration: none; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">My Location</a>
        <a href="my-partners.html" class="dropdown-item" style="display: block; padding: 10px 16px; color: #3c4043; text-decoration: none; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">My Partner</a>
        <a href="register-company.html" class="dropdown-item" style="display: block; padding: 10px 16px; color: #3c4043; text-decoration: none; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">Register Company</a>
        <a href="#" id="signout-link" class="dropdown-item" style="display: block; padding: 10px 16px; text-decoration: none; font-size: 14px; color: #d93025 !important; font-weight: 600; border-top: 1px solid #e0e0e0; margin-top: 8px; padding-top: 12px; transition: background-color 0.2s;">Sign Out</a>
      </div>
    </div>\`;

    if (!document.getElementById('nav-dropdown-styles')) {
      const styleNode = document.createElement('style');
      styleNode.id = 'nav-dropdown-styles';
      styleNode.textContent = \`.dropdown-item:hover { background-color: #f5f5f5 !important; }\`;
      document.head.appendChild(styleNode);
    }

    // Unbind and rebind to avoid duplicates
    const accountBtn = document.getElementById('account-btn');
    const dropdown = document.getElementById('account-dropdown');
    const signOutLink = document.getElementById('signout-link');

    if (accountBtn && dropdown) {
      accountBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        dropdown.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
      });
    }

    if (signOutLink) {
      signOutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await sb.auth.signOut();
        window.location.href = 'index.html';
      });
    }

    document.addEventListener('click', function(e) {
      if (dropdown && !dropdown.contains(e.target) && (!accountBtn || !accountBtn.contains(e.target))) {
        dropdown.classList.remove('active');
        dropdown.style.display = 'none';
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dropdown) {
        dropdown.classList.remove('active');
        dropdown.style.display = 'none';
      }
    });
  }

  // Use both getSession and onAuthStateChange
  if (sb && sb.auth) {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateNavigationUI(session.user);
      }
    }).catch(e => console.error("Global auth error", e));

    sb.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        updateNavigationUI(session.user);
      }
    });
  }

})();
</script>
`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('updateNavigationUI')) {
    content = content.replace(/<\/body>/i, globalScript + '\n</body>');
    fs.writeFileSync(f, content);
    console.log("Injected into " + f);
  }
});
