
async function initAuth(sb) {
  // Step 1: Check existing session
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    await updateNavbar(sb, session.user);
  } else {
    showLoggedOutNavbar();
  }

  // Step 2: Listen for ANY auth change
  // (catches Google OAuth redirect)
  sb.auth.onAuthStateChange(
    async (event, session) => {
      if (session) {
        await updateNavbar(sb, session.user);
      } else {
        showLoggedOutNavbar();
      }
    }
  );
}

async function updateNavbar(sb, user) {
  // Fetch plan from profiles table
  try {
    const { data } = await sb
      .from('profiles')
      .select('plan, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    const plan = data?.plan || 'free';
    const isPlus = plan.includes('+') || plan.toLowerCase().includes('plus');
    const name = data?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';
    const avatar = data?.avatar_url || user.user_metadata?.avatar_url;
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    // Store plan globally for page use
    window.userPlan = plan;
    window.GRABRAW_IS_PLUS = isPlus;
    window.userSession = user;
    
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
       navActions.innerHTML = `
        <div class="user-profile-menu-container" style="position: relative;">
          <button id="account-btn" class="btn" style="border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 16px; cursor: pointer; transition: all 0.2s ease; height: 40px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); text-decoration: none;">
            <span style="font-size: 14px; font-weight: 600;">My Account</span>
            <div class="avatar-wrapper" style="position: relative; display: inline-block;">
              ${avatar ? `<img src="${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="Avatar" />` : `<div style="background-color: #4285F4; color: #ffffff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; text-transform: uppercase;">${initial}</div>`}${isPlus ? '<div class="avatar-badge plus-badge" title="GrabRaw+ Member" style="position: absolute; bottom: -2px; right: -2px; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: #4285F4; border-radius: 50%; color: white; font-size: 10px; font-weight: bold; margin-left: 4px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">✦</div>' : ''}
            </div>
          </button>
          <div id="account-dropdown" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 220px; min-width: 200px; z-index: 1000; overflow: hidden; padding: 12px 0; text-align: left;">
            <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; margin-bottom: 4px; pointer-events: none; user-select: text;">
              <div style="font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Signed in as</div>
              <div style="display: flex; align-items: center;">
                 <span style="font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${user.email}">${user.email}</span>
                 ${isPlus ? '<span class="plus-badge" style="margin-left: 6px; flex-shrink: 0; box-shadow: none; border: none; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: #4285F4; border-radius: 50%; color: white; font-size: 10px; font-weight: bold;" title="GrabRaw+ Member">✦</span>' : ''}
              </div>
              ${isPlus ? '<div style="font-size: 11px; font-weight: 600; color: #4285F4; margin-top: 4px;">⭐ GrabRaw+ Member</div>' : ''}
            </div>
            <a href="profile.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043;">Profile</a>
            <a href="location.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043;">My Location</a>
            <a href="my-partners.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043;">My Partner</a>
            <a href="register-company.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043;">Register Company</a>
            <a href="#" id="signout-link" class="dropdown-item" style="color: #d93025 !important; font-weight: 600; border-top: 1px solid #e0e0e0; margin-top: 8px; padding: 12px 16px; display: block;">Sign Out</a>
          </div>
        </div>
      `;
      // Ensure dropdown works - assumed to be handled elsewhere, 
      // but let's re-add listener if needed, or rely on existing setup.                
      document.getElementById('account-btn').addEventListener('click', () => {
         const dropdown = document.getElementById('account-dropdown');
         dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      });
      document.getElementById('signout-link').addEventListener('click', async (e) => {
          e.preventDefault();
          await sb.auth.signOut();
          window.location.reload();
      });
    }
  } catch (e) {
    console.error("Error updating navbar", e);
  }
}

function showLoggedOutNavbar() {
  window.userPlan = 'free';
  window.GRABRAW_IS_PLUS = false;
  window.userSession = null;
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
      navActions.innerHTML = `
        <a href="signin.html" class="btn btn-outline" style="border-radius: 100px">Sign In</a>
        <a href="register-user.html" class="btn btn-primary" style="border-radius: 100px">Get Started</a>
      `;
  }
}
