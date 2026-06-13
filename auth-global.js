const { createClient } = window.supabase;
window.sb = createClient(
  'https://luumbrsddwupxxujnxlc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dW1icnNkZHd1cHh4dWpueGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1Mzc2MzYsImV4cCI6MjA5NjExMzYzNn0.n0fL8SIdrFJGQcIAu5RA9HfaoK9DY9z1xm_1gP_6kG8'
);

window.userSession = null;

async function updateNavbarGlobal(user) {
  window.userSession = user;
  
  const unauthNav = document.getElementById('unauthNav');
  const authNav = document.getElementById('authNav');
  const signinBtn = document.getElementById('signin-btn');
  const accountBtn = document.getElementById('account-btn');
  
  if (unauthNav) unauthNav.style.display = 'none';
  if (authNav) authNav.style.display = 'block';
  if (signinBtn) signinBtn.style.display = 'none';
  if (accountBtn) accountBtn.style.display = 'inline-flex';
  
  const dropdownEmail = document.getElementById('dropdownEmail');
  if (dropdownEmail) dropdownEmail.textContent = user.email;

  let avatarUrl = '';
  try {
      const { data } = await window.sb.from('profiles').select('avatar_url').eq('id', user.id).single();
      if (data && data.avatar_url) avatarUrl = data.avatar_url;
  } catch(e) {}

  if (accountBtn) {
      let avatarEl = document.getElementById('nav-avatar');
      if (!avatarEl) {
          avatarEl = document.createElement('span');
          avatarEl.id = 'nav-avatar';
          avatarEl.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#4285F4;color:white;font-size:13px;font-weight:600;margin-left:8px;overflow:hidden;';
          accountBtn.appendChild(avatarEl);
          accountBtn.style.cssText = accountBtn.style.cssText + 'display:inline-flex;align-items:center;';
      }
      
      if (avatarUrl) {
          avatarEl.innerHTML = `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else {
          avatarEl.textContent = user.email ? user.email.charAt(0).toUpperCase() : '?';
      }
  }

  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { session: { user } } }));
}

function showLoggedOutNavbarGlobal() {
  window.userSession = null;
  const unauthNav = document.getElementById('unauthNav');
  const authNav = document.getElementById('authNav');
  const signinBtn = document.getElementById('signin-btn');
  const accountBtn = document.getElementById('account-btn');

  if (unauthNav) unauthNav.style.display = 'block';
  if (authNav) authNav.style.display = 'none';
  if (signinBtn) signinBtn.style.display = 'flex';
  if (accountBtn) accountBtn.style.display = 'none';

  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { session: null } }));
}

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.sb.auth.getSession();
  if (session) {
    await updateNavbarGlobal(session.user);
  } else {
    showLoggedOutNavbarGlobal();
  }

  window.sb.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      await updateNavbarGlobal(session.user);
    } else {
      showLoggedOutNavbarGlobal();
    }
  });

  const signOutBtnWrapper = document.getElementById('signOutBtn');
  // Some pages have id="signOutBtn", some have id="signout-link"
  document.querySelectorAll('#signOutBtn, #signout-link').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        await window.sb.auth.signOut();
        window.location.reload(); 
      });
  });
});


function initSubscriptionModal() {
  const modalHTML = `
    <div id="subModalOverlay" class="sub-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 100000; opacity: 0; transition: opacity 0.3s ease;">
      <div class="sub-modal-content" style="background: #ffffff; width: 100%; max-width: 500px; border-radius: 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: transform 0.3s ease; position: relative;">
        <button id="closeSubModalBtn" class="close-btn" style="position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: #5f6368;" aria-label="Close">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a1a1a; font-size: 22px; font-weight: 700; margin: 0; display: inline-flex; align-items: center; gap: 8px;">
            <svg id="subModalTitleIcon" viewBox="0 0 24 24" width="24" height="24" fill="var(--icon-color, #fbbc04)" stroke="var(--icon-color, #fbbc04)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Your GrabRaw+ Subscription
          </h2>
        </div>
        
        <div id="subModalLoading" style="text-align: center; color: #5f6368; padding: 20px 0;">
          <div style="width:24px;height:24px;border:3px solid #e0e0e0;border-top-color:#4285F4;border-radius:50%;animation:sub-spin 1s linear infinite; margin: 0 auto 12px auto;"></div>
          Checking status...
        </div>

        <div id="subModalActive" style="display: none; text-align: center;">
          <div class="status-badge active-badge" style="display:inline-flex; align-items:center; justify-content:center; background:#d4edda; color:#155724; padding: 6px 24px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-bottom: 24px; gap: 6px; transform: translateY(10px); opacity: 0; transition: all 0.2s ease-out;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            ACTIVE MEMBER
          </div>
          
          <div id="subDaysRemaining" style="font-size: 36px; font-weight: 800; color: #4285F4; margin-bottom: 8px; line-height: 1;">X</div>
          <div style="font-size: 16px; color: #1a1a1a; margin-bottom: 4px;">Your subscription expires in <span id="subDaysInline"></span> days</div>
          <div id="subExpiryDate" style="font-size: 14px; color: #5f6368; margin-bottom: 32px;">Expires on: ...</div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="/plus.html" class="sub-btn primary-btn" style="display: block; width: 100%; background-color: #4285F4; color: #ffffff; text-align: center; padding: 12px; border-radius: 100px; font-size: 16px; font-weight: 600; text-decoration: none; transition: all 0.2s ease;">Renew Now</a>
            <a href="#" class="sub-btn secondary-btn" style="display: block; width: 100%; border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; text-align: center; padding: 12px; border-radius: 100px; font-size: 16px; font-weight: 600; text-decoration: none; transition: all 0.2s ease;" onclick="alert('Manage Billing integration pending.'); return false;">Manage Billing</a>
          </div>
        </div>

        <div id="subModalInactive" style="display: none; text-align: center;">
          <div class="status-badge inactive-badge" style="display:inline-flex; align-items:center; justify-content:center; background:#f5f5f5; color:#424242; padding: 6px 24px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-bottom: 24px; gap: 6px; transform: translateY(10px); opacity: 0; transition: all 0.2s ease-out;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            NOT A MEMBER
          </div>
          
          <div style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Upgrade to GrabRaw+ Today</div>
          <div style="font-size: 15px; color: #5f6368; margin-bottom: 24px;">Unlock unlimited sourcing, priority support, and export features</div>
          
          <ul style="text-align: left; font-size: 15px; color: #3c4043; margin: 0 auto 32px auto; padding: 0; list-style: none; max-width: 250px;">
            <li style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4285F4" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Unlimited searches</li>
            <li style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4285F4" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Priority support</li>
            <li style="display: flex; align-items: center; gap: 12px;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4285F4" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Export to PDF</li>
          </ul>

          <a href="/plus.html" class="sub-btn primary-btn" style="display: block; width: 100%; background-color: #4285F4; color: #ffffff; text-align: center; padding: 12px; border-radius: 100px; font-size: 16px; font-weight: 600; text-decoration: none; transition: all 0.2s ease;">Upgrade to GrabRaw+ — ₹199/month</a>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById('subModalOverlay')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes sub-spin { 100% { transform: rotate(360deg); } }
      .sub-btn:hover { transform: scale(1.02); }
      .primary-btn:hover { background-color: #3b77db !important; box-shadow: 0 4px 12px rgba(66,133,244,0.25); }
      .secondary-btn:hover { background-color: #f8f9fa !important; }
      .status-badge.show { transform: translateY(0) !important; opacity: 1 !important; }
      @media (max-width: 480px) {
        .sub-modal-content { max-width: 90vw !important; padding: 24px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.getElementById('subModalOverlay');
  const closeBtn = document.getElementById('closeSubModalBtn');
  const loading = document.getElementById('subModalLoading');
  const activeView = document.getElementById('subModalActive');
  const inactiveView = document.getElementById('subModalInactive');
  const card = overlay.querySelector('.sub-modal-content');
  const titleIcon = document.getElementById('subModalTitleIcon');

  function closeModal() {
    overlay.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // reset slide-in
    document.querySelectorAll('.status-badge').forEach(b => b.classList.remove('show'));
    
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }

  function openModal() {
    overlay.style.display = 'flex';
    // reset icon color
    titleIcon.style.setProperty('--icon-color', '#fbbc04');
    titleIcon.setAttribute('fill', 'var(--icon-color, #fbbc04)');
    
    setTimeout(() => {
      overlay.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 10);
    fetchData();
  }

  async function fetchData() {
    loading.style.display = 'block';
    activeView.style.display = 'none';
    inactiveView.style.display = 'none';

    try {
      const { data: { session } } = await window.sb.auth.getSession();
      if (!session) {
        showInactive();
        return;
      }
      
      const { data: profile } = await window.sb.from('profiles').select('subscription_active, subscription_expiry, subscription_plan').eq('id', session.user.id).single();
      
      if (profile && profile.subscription_active && profile.subscription_expiry) {
        const expiryDate = new Date(profile.subscription_expiry);
        const today = new Date();
        const diffMs = expiryDate - today;
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (days > 0) {
          document.getElementById('subDaysRemaining').textContent = days;
          document.getElementById('subDaysInline').textContent = days;
          
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          document.getElementById('subExpiryDate').textContent = "Expires on: " + expiryDate.toLocaleDateString(undefined, options);
          
          showActive();
        } else {
          // expired
          showInactive();
        }
      } else {
        showInactive();
      }
    } catch(e) {
      console.error(e);
      showInactive(); // fallback
    } finally {
      loading.style.display = 'none';
    }
  }
  
  function showActive() {
    activeView.style.display = 'block';
    // Keep star icon colored
    titleIcon.style.setProperty('--icon-color', '#fbbc04'); // gold/yellow inside
    titleIcon.setAttribute('fill', 'var(--icon-color, #fbbc04)');
    setTimeout(() => {
      const badge = activeView.querySelector('.status-badge');
      if (badge) badge.classList.add('show');
    }, 50); // slight delay for slide-in effect
  }
  
  function showInactive() {
    inactiveView.style.display = 'block';
    // Grey out title icon
    titleIcon.style.setProperty('--icon-color', '#dadce0');
    titleIcon.setAttribute('fill', 'none'); // not filled if inactive, or filled with light grey
    setTimeout(() => {
      const badge = inactiveView.querySelector('.status-badge');
      if (badge) badge.classList.add('show');
    }, 50); // slight delay for slide-in effect
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-subscription-modal')) {
      e.preventDefault();
      openModal();
      
      // Close mobile dropdown if it is open
      const accountDropdown = document.getElementById('accountDropdown');
      if (accountDropdown) {
        accountDropdown.style.opacity = '0';
        setTimeout(() => { accountDropdown.style.display = 'none'; }, 150);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSubscriptionModal();
});
