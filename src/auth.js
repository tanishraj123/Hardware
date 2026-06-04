
async function initAuth(sb) {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    await updateNavbar(sb, session.user);
  } else {
    showLoggedOutNavbar();
  }

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
  let plan = 'free';
  try {
    const { data } = await sb
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
    if (data && data.plan) {
      plan = data.plan;
    }
  } catch (e) {}

  window.userPlan = plan;
  window.GRABRAW_IS_PLUS = plan.includes('+') || plan.toLowerCase().includes('plus');
  window.userSession = user;

  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    // Inject the exact required structure dynamically for the auth'd files
    navActions.innerHTML = `
      <div id="unauthNav" style="display: none;">
        <a href="/signin.html" class="btn btn-outline" style="border-radius: 100px">Sign In</a>
        <a href="/register-user.html" class="btn btn-primary" style="border-radius: 100px">Get Started</a>
      </div>
      <div id="authNav" style="display: block; position: relative;">
        <button id="account-btn" class="btn btn-outline" style="border-radius: 100px;">My Account</button>
        <div id="accountDropdown" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); width: 220px; z-index: 10000; overflow: hidden; padding: 12px 0; text-align: left; opacity: 0; transition: opacity 150ms ease;">
          <div class="dropdown-header" style="padding: 12px 16px;">
            <span class="dropdown-label" style="display:block; font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">SIGNED IN AS</span>
            <span id="dropdownEmail" style="display:block; font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${user.email}</span>
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
    `;

    bindDropdownEvents(sb);
  }
}

function showLoggedOutNavbar() {
  window.userPlan = 'free';
  window.GRABRAW_IS_PLUS = false;
  window.userSession = null;

  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.innerHTML = `
      <div id="unauthNav" style="display: block;">
        <a href="/signin.html" class="btn btn-outline" style="border-radius: 100px">Sign In</a>
        <a href="/register-user.html" class="btn btn-primary" style="border-radius: 100px">Get Started</a>
      </div>
      <div id="authNav" style="display: none; position: relative;"></div>
    `;
  }
}

function bindDropdownEvents(sb) {
  const accountBtn = document.getElementById('account-btn');
  const accountDropdown = document.getElementById('accountDropdown');
  const signOutBtn = document.getElementById('signOutBtn');

  if (accountBtn && accountDropdown) {
    accountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (accountDropdown.style.display === 'none') {
        accountDropdown.style.display = 'block';
        setTimeout(() => accountDropdown.style.opacity = '1', 10);
      } else {
        accountDropdown.style.opacity = '0';
        setTimeout(() => accountDropdown.style.display = 'none', 150);
      }
    });
  }

  // Set up global click listener once if not already set by inline script
  if (!window.dropdownCloserBound) {
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('accountDropdown');
      const btn = document.getElementById('account-btn');
      if (dropdown && dropdown.style.display !== 'none') {
        if (!dropdown.contains(e.target) && (!btn || !btn.contains(e.target))) {
          dropdown.style.opacity = '0';
          setTimeout(() => dropdown.style.display = 'none', 150);
        }
      }
    });
    window.dropdownCloserBound = true;
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await sb.auth.signOut();
      window.location.reload();
    });
  }
}

