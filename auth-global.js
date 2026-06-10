// Dark Mode Initialization
(function() {
  const theme = localStorage.getItem('grabraw-theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  const style = document.createElement('style');
  style.textContent = `
    html.dark body { background-color: #0a0a0a !important; color: #ededed !important; }
    html.dark .navbar, html.dark header, html.dark footer, html.dark main, 
    html.dark section, html.dark .search-row-section, html.dark .footer-bottom, 
    html.dark .hero, html.dark .categories-section, html.dark .how-it-works, 
    html.dark .trending, html.dark .supplier-reg, html.dark .profile-container { 
      background-color: #0a0a0a !important; 
      border-color: #2a2a2a !important;
    }
    
    html.dark .card, html.dark .material-card, html.dark .step-card, 
    html.dark .trending-card, html.dark .sample-bom-card, html.dark .auth-card,
    html.dark .settings-card, html.dark .billing-card { 
      background-color: #111111 !important; 
      border-color: #2a2a2a !important; 
      color: #ededed !important; 
    }
    
    html.dark .card:hover, html.dark .material-card:hover, 
    html.dark .step-card:hover, html.dark .trending-card:hover {
      border-color: #3a3a3a !important;
    }
    
    html.dark input, html.dark select, html.dark textarea, 
    html.dark .search-box-container, html.dark .search-box, 
    html.dark #account-dropdown, html.dark .nav-links, 
    html.dark .btn-outline, html.dark .btn-supplier-web, 
    html.dark .btn-icon-round:not(.saved), html.dark .sample-supplier-block { 
      background-color: #1a1a1a !important; 
      border-color: #2a2a2a !important; 
      color: #ededed !important; 
    }
    
    html.dark .btn-outline:hover, html.dark .btn-supplier-web:hover,
    html.dark .btn-icon-round:not(.saved):hover {
      background-color: #111111 !important;
      border-color: #3a3a3a !important;
    }
    
    html.dark #bom-mini-filter {
      background-color: #1a1a1a !important;
      border-color: #2a2a2a !important;
      color: #ededed !important;
    }
    html.dark #bom-mini-filter:focus {
      border-color: #3b82f6 !important;
    }
    
    html.dark #account-dropdown a, html.dark #account-dropdown button, 
    html.dark #account-dropdown .dropdown-item { 
      color: #ededed !important; 
      background-color: #1a1a1a !important; 
    }
    html.dark #account-dropdown a:hover, html.dark #account-dropdown button:hover, 
    html.dark #account-dropdown .dropdown-item:hover { 
      background-color: #111111 !important; 
    }
    html.dark #signout-link, html.dark #signOutBtn {
      border-top-color: #2a2a2a !important;
    }
    
    html.dark h1, html.dark h2, html.dark h3, html.dark h4, 
    html.dark .navbar-logo-text, html.dark .footer-logo-text, 
    html.dark .bom-title, html.dark .material-name, html.dark .supplier-name,
    html.dark .scroller-title, html.dark .step-title, html.dark .trending-title { 
      color: #ededed !important; 
    }
    
    html.dark .bom-subtext, html.dark .footer-description, html.dark .footer-title, 
    html.dark .copyright, html.dark .search-stats-text, html.dark .step-desc, 
    html.dark .trending-desc, html.dark .supplier-address, html.dark .alt-city, 
    html.dark #bom-filter-stats, html.dark .alt-section-label, html.dark .distance-badge, 
    html.dark .suggestion-label, html.dark .stat-dot, html.dark .sample-item-qty, 
    html.dark .sample-supplier-meta, html.dark .search-icon, html.dark .search-icon-left svg,
    html.dark .hero-tagline, html.dark .hero-subtitle, html.dark .alt-badges .distance-badge {
      color: #888888 !important;
      background-color: transparent !important;
    }
    html.dark .distance-badge {
      background-color: #1a1a1a !important;
      border: 1px solid #2a2a2a !important;
    }
    
    html.dark input::placeholder, html.dark textarea::placeholder { 
      color: #555555 !important; 
    }
    
    html.dark .nav-link, html.dark .footer-link, html.dark .footer-legal-link { 
      color: #888888 !important; 
    }
    html.dark .nav-link:hover, html.dark .footer-link:hover, html.dark .footer-legal-link:hover { 
      color: #3b82f6 !important; 
      background-color: transparent !important;
    }
    html.dark .navbar .nav-link:hover {
      background-color: #1a1a1a !important;
    }
    
    html.dark .btn-primary, html.dark .btn-search, html.dark .btn-download-bom, 
    html.dark .btn-supplier-maps, html.dark .mobile-nav-getstarted, html.dark .step-num, 
    html.dark .trending-btn, html.dark .btn-ai-cta, html.dark #load-more-btn { 
      background-color: #3b82f6 !important; 
      color: #ffffff !important; 
      border: none !important;
    }
    html.dark .btn-primary:hover, html.dark .btn-search:hover, html.dark .btn-download-bom:hover, 
    html.dark .btn-supplier-maps:hover, html.dark .mobile-nav-getstarted:hover, 
    html.dark .trending-btn:hover, html.dark .btn-ai-cta:hover, html.dark #load-more-btn:hover { 
      background-color: #2563eb !important; 
    }
    
    html.dark .stock-indicator.in-stock, html.dark .live-badge, 
    html.dark .sample-supplier-badge, html.dark .btn-icon-round.saved { 
      background-color: #166534 !important; 
      color: #bbf7d0 !important; 
      border-color: #166534 !important;
    }
    html.dark .stock-indicator.in-stock .stock-dot, html.dark .live-badge .dot,
    html.dark .sample-supplier-badge { 
      background-color: #bbf7d0 !important; 
    }
    html.dark .stock-indicator.in-stock {
      padding: 0px 8px; border-radius: 100px;
    }
    
    html.dark .stock-indicator.low-stock, html.dark .stock-indicator.out-of-stock { 
      background-color: #7f1d1d !important; 
      color: #fecaca !important; 
      border-color: #7f1d1d !important;
      padding: 0px 8px; border-radius: 100px;
    }
    html.dark .stock-indicator.low-stock .stock-dot, html.dark .stock-indicator.out-of-stock .stock-dot { 
      background-color: #fecaca !important; 
    }
    
    html.dark #plan-banner-container > div[style*="background:#f0fdf4"] {
      background-color: #166534 !important;
      color: #bbf7d0 !important;
      border-color: #166534 !important;
    }
    html.dark #plan-banner-container > div[style*="background:#eff6ff"] {
      background-color: #111111 !important;
      color: #ededed !important;
      border-bottom: 1px solid #2a2a2a !important;
    }
    html.dark #plan-banner-container > div[style*="background:#eff6ff"] a {
      color: #3b82f6 !important;
    }
    html.dark #plan-banner-container button {
      color: #888888 !important;
    }
    
    html.dark .sample-item, html.dark .alt-supplier-row, html.dark .alt-suppliers-section, html.dark .sample-header, html.dark .hero {
      border-color: #2a2a2a !important;
    }
    html.dark .sample-header, html.dark table th {
      background-color: #1a1a1a !important;
      color: #ededed !important;
    }
    html.dark .suggestion-chip {
      background-color: #111111 !important;
      border-color: #2a2a2a !important;
      color: #ededed !important;
    }
    html.dark .suggestion-chip:hover {
      background-color: #1a1a1a !important;
      border-color: #3b82f6 !important;
      color: #3b82f6 !important;
    }
    
    html.dark .navbar-logo-image, html.dark .footer-logo-image {
      filter: invert(1) hue-rotate(180deg) brightness(1.5);
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
      background-color: #3b82f6;
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
        <span class="toggle-label-ui">
           <span id="theme-icon">${isDark ? '🌙' : '☀️'}</span> Dark Mode
        </span>
        <div class="toggle-switch-ui"></div>
     `;
     toggleDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentlyDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('grabraw-theme', currentlyDark ? 'dark' : 'light');
        document.getElementById('theme-icon').textContent = currentlyDark ? '🌙' : '☀️';
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
