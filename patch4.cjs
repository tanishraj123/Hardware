const fs = require('fs');

const perfectNav = `    <header class="navbar">
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
        <a href="/signin" class="nav-link mobile-nav-signin" style="display: none">Sign In</a>
        <a href="/register-user" class="btn mobile-nav-getstarted" style="display: none" aria-label="Get Started">Get Started</a>
      </nav>
      <div class="nav-actions">
        <!-- Replaced via Auth script -->
        <a href="/signin.html" class="btn btn-outline" style="border-radius: 100px;">Sign In</a>
        <a href="/register-user.html" class="btn btn-primary" style="border-radius: 100px;">Get Started</a>
      </div>
    </header>`;

const perfectScriptInner = `const { createClient } = supabase;
      const sb = createClient(
        "https://luumbrsddwupxxujnxlc.supabase.co",
        "sb_publishable_YZot9m514LEeiSGMscXoqw_WfjHOO1i"
      );

      async function initAuth() {
        const { data: { session } } = await sb.auth.getSession();
        if (session) { 
          await updateNavbar(session.user); 
        } else {
          showLoggedOutNavbar();
        }

        sb.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            await updateNavbar(session.user);
          } else {
            showLoggedOutNavbar();
          }
        });
      }

      async function updateNavbar(user) {
        let isPlus = false;
        if (window.GRABRAW_IS_PLUS !== undefined) {
          isPlus = window.GRABRAW_IS_PLUS;
        } else {
          try {
            const { data } = await sb
              .from("profiles")
              .select("plan")
              .eq("id", user.id)
              .single();
            if (data && typeof data.plan === "string" && (data.plan.includes("+") || data.plan.toLowerCase().includes("plus"))) {
              isPlus = true;
            }
          } catch (e) {}
          window.GRABRAW_IS_PLUS = isPlus;
        }

        const navActions = document.querySelector(".nav-actions");
        if (navActions) {
          const email = user.email || "";
          const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "";
          const initial = name ? name.charAt(0).toUpperCase() : "?";
          const avatar = user.user_metadata?.avatar_url;

          const badgeHtml = isPlus
            ? '<div class="avatar-badge plus-badge" title="GrabRaw+ Member" style="position: absolute; bottom: -2px; right: -2px; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: #4285F4; border-radius: 50%; color: white; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">✦</div>'
            : "";

          navActions.innerHTML = \`
            <div class="user-profile-menu-container" style="position: relative;">
              <button id="account-btn" class="btn" style="border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 16px; cursor: pointer; transition: all 0.2s ease; height: 40px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); text-decoration: none;">
                <span style="font-size: 14px; font-weight: 600;">My Account</span>
                <div class="avatar-wrapper" style="position: relative; display: inline-block;">
                  \${avatar ? \`<img src="\${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="Avatar" />\` : \`<div style="background-color: #4285F4; color: #ffffff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; text-transform: uppercase;">\${initial}</div>\`}\${badgeHtml}
                </div>
              </button>
              <div id="account-dropdown" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 220px; min-width: 200px; z-index: 1000; overflow: hidden; padding: 12px 0; text-align: left;">
                <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; margin-bottom: 4px; pointer-events: none; user-select: text;">
                  <div style="font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Signed in as</div>
                  <div style="display: flex; align-items: center;">
                     <span style="font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="\${email}">\${email}</span>
                     \${isPlus ? \`<span class="plus-badge" style="margin-left: 6px; flex-shrink: 0; position: static; box-shadow: none; border: none; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: #4285F4; border-radius: 50%; color: white; font-size: 10px; font-weight: bold;" title="GrabRaw+ Member">✦</span>\` : ""}
                  </div>
                  \${isPlus ? \`<div style="font-size: 11px; font-weight: 600; color: #4285F4; margin-top: 4px;">⭐ GrabRaw+ Member</div>\` : ""}
                </div>
                <a href="/profile.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">Profile</a>
                <a href="/location.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">My Location</a>
                <a href="/my-partners.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">My Partner</a>
                <a href="/register-company.html" class="dropdown-item" style="padding: 8px 16px; display: block; color: #3c4043; text-decoration: none;">Register Company</a>
                <hr style="margin: 4px 0; border: none; border-top: 1px solid #e0e0e0;">
                <a href="#" id="signout-link" class="dropdown-item" style="color: #d93025 !important; font-weight: 600; padding: 8px 16px; display: block; text-decoration: none;">Sign Out</a>
              </div>
            </div>
          \`;

          if (!document.getElementById("dropdown-style")) {
            const styleNode = document.createElement("style");
            styleNode.id = "dropdown-style";
            styleNode.textContent = \`.dropdown-item:hover { background-color: #f5f5f5 !important; }\`;
            document.head.appendChild(styleNode);
          }

          const accountBtn = document.getElementById("account-btn");
          const dropdown = document.getElementById("account-dropdown");
          const signOutLink = document.getElementById("signout-link");

          if (accountBtn && dropdown) {
            accountBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (dropdown.style.display === "none") {
                dropdown.style.display = "block";
              } else {
                dropdown.style.display = "none";
              }
            });
          }

          if (signOutLink) {
            signOutLink.addEventListener("click", async (e) => {
              e.preventDefault();
              await sb.auth.signOut();
              window.location.reload();
            });
          }
        }
      }

      function showLoggedOutNavbar() {
        const navActions = document.querySelector(".nav-actions");
        if (navActions) {
          const redirectQs = "?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
          navActions.innerHTML = \`
            <a href="/signin.html\${redirectQs}" class="btn btn-outline" style="border-radius: 100px;">Sign In</a>
            <a href="/register-user.html\${redirectQs}" class="btn btn-primary" style="border-radius: 100px;">Get Started</a>
          \`;
        }
      }

      document.addEventListener("click", function (e) {
        const dropdown = document.getElementById("account-dropdown");
        const accountBtn = document.getElementById("account-btn");
        if (dropdown && !dropdown.contains(e.target) && (!accountBtn || !accountBtn.contains(e.target))) {
          dropdown.style.display = "none";
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          const dropdown = document.getElementById("account-dropdown");
          if (dropdown) dropdown.style.display = "none";
        }
      });

      initAuth();`;

const files = ["register-company.html"];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/<header class="navbar">[\s\S]*?<\/header>/, perfectNav);
  
  const regex1 = /const \{ createClient \} = supabase;[\s\S]*?initAuth\(\);/;
  if (regex1.test(content)) {
    content = content.replace(regex1, perfectScriptInner);
  }
  
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}
