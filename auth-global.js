// Dark Mode Initialization
(function() {
  const theme = localStorage.getItem('grabraw-theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  const style = document.createElement('style');
  style.textContent = `
    html.dark body { background-color: #1c1c1e !important; color: #f5f5f7 !important; }
    
    html.dark main, html.dark section, html.dark .search-row-section, 
    html.dark .hero, html.dark .categories-section, html.dark .how-it-works, 
    html.dark .trending, html.dark .supplier-reg, html.dark .profile-container { 
      background-color: #1c1c1e !important; 
      border-color: #3a3a3c !important;
    }
    
    .navbar, header {
      position: sticky !important;
      top: 0 !important;
      z-index: 50 !important;
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    }
    
    html.dark .navbar, html.dark header {
      background: rgba(28, 28, 30, 0.75) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: none !important;
    }
    
    html.dark footer, html.dark .footer-bottom {
      background-color: #161618 !important;
      border-color: #3a3a3c !important;
    }
    
    html.dark .card, html.dark .material-card, html.dark .step-card, 
    html.dark .trending-card, html.dark .sample-bom-card, html.dark .auth-card,
    html.dark .settings-card, html.dark .billing-card { 
      background-color: #2c2c2e !important; 
      border: 1px solid #3a3a3c !important; 
      color: #f5f5f7 !important; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
    }
    
    html.dark .card:hover, html.dark .material-card:hover, 
    html.dark .step-card:hover, html.dark .trending-card:hover {
      border-color: #48484a !important;
    }
    
    html.dark .search-box-container, html.dark .search-box, 
    html.dark #account-dropdown, html.dark .nav-links, 
    html.dark .sample-supplier-block { 
      background-color: #2c2c2e !important; 
      border-color: #3a3a3c !important; 
      color: #f5f5f7 !important; 
    }
    
    html.dark input, html.dark select, html.dark textarea {
      background-color: #3a3a3c !important;
      border: 1px solid #48484a !important;
      color: #f5f5f7 !important;
    }
    
    html.dark .btn-outline, html.dark .btn-secondary, html.dark .btn-export, html.dark .btn-remove, html.dark .btn-supplier-web, html.dark .btn-icon-round:not(.saved) {
      background-color: #3a3a3c !important;
      border: 1px solid #48484a !important;
      color: #f5f5f7 !important;
    }
    
    html.dark .profile-card, html.dark .partner-card, html.dark .white-card {
      background-color: #2c2c2e !important;
      border: 1px solid #3a3a3c !important;
      color: #f5f5f7 !important;
    }

    html.dark .section-heading, html.dark .page-title, html.dark .component-name {
      color: #888888 !important;
    }
    
    html.dark .section-subtext, html.dark .page-subtitle, html.dark .account-meta, html.dark .meta-date, html.dark .file-types {
      color: #aeaeb2 !important;
    }
    
    html.dark .section-div, html.dark .partner-header {
      border-bottom-color: #3a3a3c !important;
      border-color: #3a3a3c !important;
    }
    
    html.dark .danger-zone {
      border-color: #4a1c1c !important;
    }
    
    html.dark .success-text {
      background-color: #1c3a2a !important;
      color: #34d058 !important;
    }
    
    html.dark .search-box input {
      background-color: transparent !important;
    }
    
    html.dark .search-box:focus-within {
      border-color: #0a84ff !important;
    }
    
    html.dark input:focus, html.dark select:focus, html.dark textarea:focus {
      border-color: #0a84ff !important;
    }
    
    html.dark #account-dropdown {
      box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
    }
    
    html.dark .btn-outline:hover, html.dark .btn-supplier-web:hover,
    html.dark .btn-icon-round:not(.saved):hover {
      background-color: #3a3a3c !important;
      border-color: #48484a !important;
    }
    
    html.dark #bom-mini-filter {
      background-color: #2c2c2e !important;
      border-color: #3a3a3c !important;
      color: #f5f5f7 !important;
    }
    html.dark #bom-mini-filter:focus {
      border-color: #0a84ff !important;
    }
    
    html.dark #account-dropdown a, html.dark #account-dropdown button, 
    html.dark #account-dropdown .dropdown-item { 
      color: #f5f5f7 !important; 
      background-color: #2c2c2e !important; 
    }
    html.dark #account-dropdown a:hover, html.dark #account-dropdown button:hover, 
    html.dark #account-dropdown .dropdown-item:hover { 
      background-color: #3a3a3c !important; 
    }
    html.dark #signout-link, html.dark #signOutBtn {
      border-top-color: #3a3a3c !important;
    }
    
    html.dark h1, html.dark h2, html.dark h3, html.dark h4, 
    html.dark .navbar-logo-text, html.dark .footer-logo-text, 
    html.dark .bom-title, html.dark .material-name, html.dark .supplier-name,
    html.dark .scroller-title, html.dark .step-title, html.dark .trending-title { 
      color: #f5f5f7 !important; 
    }
    
    html.dark .bom-subtext, html.dark .footer-description, html.dark .footer-title, 
    html.dark .copyright, html.dark .search-stats-text, html.dark .step-desc, 
    html.dark .trending-desc, html.dark .supplier-address, html.dark .alt-city, 
    html.dark #bom-filter-stats, html.dark .alt-section-label, html.dark .distance-badge, 
    html.dark .suggestion-label, html.dark .stat-dot, html.dark .sample-item-qty, 
    html.dark .sample-supplier-meta, html.dark .search-icon, html.dark .search-icon-left svg,
    html.dark .hero-tagline, html.dark .hero-subtitle, html.dark .alt-badges .distance-badge {
      color: #aeaeb2 !important;
      background-color: transparent !important;
    }
    html.dark .distance-badge, html.dark .category-badge, html.dark .bom-category, html.dark .pill-tag {
      background-color: #2c2c2e !important;
      border: 1px solid #48484a !important;
      color: #aeaeb2 !important;
    }
    
    html.dark input::placeholder, html.dark textarea::placeholder { 
      color: #6c6c70 !important; 
    }
    
    html.dark .nav-link, html.dark .footer-link, html.dark .footer-legal-link { 
      color: #aeaeb2 !important; 
    }
    html.dark .nav-link:hover, html.dark .footer-link:hover, html.dark .footer-legal-link:hover { 
      color: #0a84ff !important; 
      background-color: transparent !important;
    }
    html.dark .navbar .nav-link:hover {
      background-color: #2c2c2e !important;
    }
    
    html.dark .btn-primary, html.dark .btn-search, html.dark .btn-download-bom, 
    html.dark .btn-supplier-maps, html.dark .mobile-nav-getstarted, html.dark .step-num, 
    html.dark .trending-btn, html.dark .btn-ai-cta, html.dark #load-more-btn { 
      background-color: #0a84ff !important; 
      color: #ffffff !important; 
      border: none !important;
    }
    html.dark .btn-primary:hover, html.dark .btn-search:hover, html.dark .btn-download-bom:hover, 
    html.dark .btn-supplier-maps:hover, html.dark .mobile-nav-getstarted:hover, 
    html.dark .trending-btn:hover, html.dark .btn-ai-cta:hover, html.dark #load-more-btn:hover { 
      background-color: #0071e3 !important; 
    }
    
    html.dark .stock-indicator.in-stock, html.dark .live-badge, 
    html.dark .sample-supplier-badge, html.dark .btn-icon-round.saved { 
      background-color: #1c3a2a !important; 
      color: #34d058 !important; 
      border-color: #1c3a2a !important;
    }
    html.dark .stock-indicator.in-stock .stock-dot, html.dark .live-badge .dot,
    html.dark .sample-supplier-badge { 
      background-color: #34d058 !important; 
    }
    html.dark .stock-indicator.in-stock {
      padding: 0px 8px; border-radius: 100px;
    }
    
    html.dark .stock-indicator.low-stock { 
      background-color: #3a2a1c !important; 
      color: #f0a050 !important; 
      border-color: #3a2a1c !important;
      padding: 0px 8px; border-radius: 100px;
    }
    html.dark .stock-indicator.out-of-stock { 
      background-color: #3a1c1c !important; 
      color: #f47067 !important; 
      border-color: #3a1c1c !important;
      padding: 0px 8px; border-radius: 100px;
    }
    html.dark .stock-indicator.low-stock .stock-dot { 
      background-color: #f0a050 !important; 
    }
    html.dark .stock-indicator.out-of-stock .stock-dot { 
      background-color: #f47067 !important; 
    }
    
    html.dark #plan-banner-container > div[style*="background:#f0fdf4"] {
      background-color: #1c3a2a !important;
      color: #34d058 !important;
      border-color: #1c3a2a !important;
    }
    html.dark #plan-banner-container > div[style*="background:#eff6ff"] {
      background-color: #2c2c2e !important;
      color: #f5f5f7 !important;
      border-bottom: 1px solid #3a3a3c !important;
    }
    html.dark #plan-banner-container > div[style*="background:#eff6ff"] a {
      color: #0a84ff !important;
    }
    html.dark #plan-banner-container button {
      color: #aeaeb2 !important;
    }
    
    html.dark .sample-item, html.dark .alt-supplier-row, html.dark .alt-suppliers-section, html.dark .sample-header, html.dark .hero {
      border-color: #3a3a3c !important;
    }
    html.dark .sample-header, html.dark table th {
      background-color: #2c2c2e !important;
      color: #f5f5f7 !important;
    }
    html.dark .suggestion-chip {
      background-color: #2c2c2e !important;
      border-color: #3a3a3c !important;
      color: #aeaeb2 !important;
    }
    html.dark .suggestion-chip:hover {
      background-color: #3a3a3c !important;
      border-color: #0a84ff !important;
      color: #0a84ff !important;
    }
    
    html.dark .navbar-logo-image, html.dark .footer-logo-image {
      filter: none !important;
      background: transparent !important;
      mix-blend-mode: normal !important;
    }
    
    .dark-mode-toggle {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .toggle-switch-ui {
      position: relative;
      width: 36px;
      height: 20px;
      background-color: #ccc;
      border-radius: 20px;
      transition: .4s;
    }
    html.dark .toggle-switch-ui {
      background-color: #0a84ff;
    }
    .toggle-switch-ui::before {
      content: "";
      position: absolute;
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      border-radius: 50%;
      transition: .4s;
    }
    html.dark .toggle-switch-ui::before {
      transform: translateX(16px);
    }
    .toggle-label-ui {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `;
  document.head.appendChild(style);
})();

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

  // Inject Dark Mode toggle when dropdown is added to DOM
  const observer = new MutationObserver((mutations) => {
    for (let m of mutations) {
      for (let node of m.addedNodes) {
         if (node.nodeType === 1) { // ELEMENT_NODE
            const dropdowns = (node.nodeName === 'DIV' && node.id === 'account-dropdown') 
               ? [node] 
               : node.querySelectorAll ? node.querySelectorAll('#account-dropdown') : [];
            for (const dropdown of dropdowns) {
               if (!dropdown.querySelector('.dark-mode-toggle')) {
                  injectThemeToggle(dropdown);
               }
            }
         }
      }
    }
  });

  const bodyEl = document.body || document.documentElement;
  if (bodyEl) observer.observe(bodyEl, { childList: true, subtree: true });

  function injectThemeToggle(dropdown) {
     const signoutLink = dropdown.querySelector('#signout-link') || dropdown.querySelector('#signOutBtn');
     if (!signoutLink) return;

     // Also find 'Register Company' link to place it after it
     const links = dropdown.querySelectorAll('a.dropdown-item');
     let registerObj = null;
     links.forEach(l => {
       if (l.textContent.includes('Register Company')) {
         registerObj = l;
       }
     });

     const toggleDiv = document.createElement('div');
     toggleDiv.className = 'dropdown-item dark-mode-toggle';
     const isDark = document.documentElement.classList.contains('dark');
     toggleDiv.innerHTML = `
        <span class="toggle-label-ui">Dark Mode</span>
        <div class="toggle-switch-ui"></div>
     `;
     toggleDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentlyDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('grabraw-theme', currentlyDark ? 'dark' : 'light');
     });
     
     if (registerObj && registerObj.nextSibling) {
       dropdown.insertBefore(toggleDiv, registerObj.nextSibling);
     } else {
       dropdown.insertBefore(toggleDiv, signoutLink);
     }
  }

  // Fallback if dropdown is already there at load
  const existingDropdown = document.getElementById('account-dropdown');
  if (existingDropdown) {
    injectThemeToggle(existingDropdown);
  }
});
