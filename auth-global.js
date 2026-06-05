const { createClient } = window.supabase;
window.sb = createClient(
  'https://luumbrsddwupxxujnxlc.supabase.co',
  'sb_publishable_YZot9m514LEeiSGMscXoqw_WfjHOO1i'
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
