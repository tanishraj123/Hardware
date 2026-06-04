const fs = require('fs');

const files = [
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

const sharedAuthLogic = `// Global Auth State Wrapper
      async function initializeGlobalAuth() {
        async function updateNavUI(user) {
            let isPlus = false;
            if (window.GRABRAW_IS_PLUS !== undefined) {
              isPlus = window.GRABRAW_IS_PLUS;
            } else if (user) {
              try {
                const { data } = await sb
                  .from("profiles")
                  .select("plan")
                  .eq("id", user.id)
                  .single();
                if (
                  data &&
                  typeof data.plan === "string" &&
                  (data.plan.includes("+") ||
                    data.plan.toLowerCase().includes("plus"))
                ) {
                  isPlus = true;
                }
              } catch (e) {}
              window.GRABRAW_IS_PLUS = isPlus; // Ensure it's globally available
            }

            const navActions = document.querySelector(".nav-actions");
            if (navActions && user) {
              const email = user.email || "";
              const name =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email ||
                "";
              const initial = name ? name.charAt(0).toUpperCase() : "?";
              const avatar = user.user_metadata?.avatar_url;

              const badgeHtml = isPlus
                ? '<div class="avatar-badge plus-badge" title="GrabRaw+ Member">✦</div>'
                : "";

              navActions.innerHTML = \`
              <div class="user-profile-menu-container" style="position: relative;">
                <button id="account-btn" class="btn" style="border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 16px; cursor: pointer; transition: all 0.2s ease; height: 40px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); text-decoration: none;">
                  <span style="font-size: 14px; font-weight: 600;">My Account</span>
                  <div class="avatar-wrapper">
                    \${avatar ? \\\`<img src="\${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="Avatar" />\\\` : \\\`<div style="background-color: #4285F4; color: #ffffff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; text-transform: uppercase;">\${initial}</div>\\\`}\${badgeHtml}
                  </div>
                </button>
                <div id="account-dropdown" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 220px; min-width: 200px; z-index: 1000; overflow: hidden; padding: 12px 0; text-align: left;">
                  <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; margin-bottom: 4px; pointer-events: none; user-select: text;">
                    <div style="font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Signed in as</div>
                    <div style="display: flex; align-items: center;">
                       <span style="font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="\${email}">\${email}</span>
                       \${isPlus ? '<span class="plus-badge" style="margin-left: 6px; flex-shrink: 0; position: static; box-shadow: none; border: none;" title="GrabRaw+ Member">✦</span>' : ""}
                    </div>
                    \${isPlus ? '<div style="font-size: 11px; font-weight: 600; color: #4285F4; margin-top: 4px;">⭐ GrabRaw+ Member</div>' : ""}
                  </div>
                  <a href="profile.html" class="dropdown-item">Profile</a>
                  <a href="location.html" class="dropdown-item">My Location</a>
                  <a href="my-partners.html" class="dropdown-item">My Partner</a>
                  <a href="register-company.html" class="dropdown-item">Register Company</a>
                  <a href="#" id="signout-link" class="dropdown-item" style="color: #d93025 !important; font-weight: 600; border-top: 1px solid #e0e0e0; margin-top: 8px; padding-top: 12px;">Sign Out</a>
                </div>
              </div>
              \`;
              
              const accountBtn = document.getElementById("account-btn");
              const dropdown = document.getElementById("account-dropdown");
              const signOutLink = document.getElementById("signout-link");

              if (!document.getElementById('nav-dropdown-styles')) {
                  const styleNode = document.createElement("style");
                  styleNode.id = 'nav-dropdown-styles';
                  styleNode.textContent = \`
                  .dropdown-item:hover {
                    background-color: #f5f5f5 !important;
                  }
                  \`;
                  document.head.appendChild(styleNode);
              }

              if (accountBtn && dropdown) {
                // Remove existing click by cloning (if any)
                const newAccountBtn = accountBtn.cloneNode(true);
                accountBtn.parentNode.replaceChild(newAccountBtn, accountBtn);
                newAccountBtn.addEventListener("click", (e) => {
                  e.stopPropagation();
                  dropdown.classList.toggle("active");
                });
              }

              if (signOutLink) {
                const newSignOutLink = signOutLink.cloneNode(true);
                signOutLink.parentNode.replaceChild(newSignOutLink, signOutLink);
                newSignOutLink.addEventListener("click", async (e) => {
                  e.preventDefault();
                  await sb.auth.signOut();
                  window.location.href = "index.html";
                });
              }
            }
        }
        
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session?.user) {
             await updateNavUI(session.user);
          }
          
          sb.auth.onAuthStateChange(async (event, session) => {
             if (session?.user) {
                 await updateNavUI(session.user);
             } else {
                 // optionally handle sign out state, but page load does it initially.
             }
          });

        } catch(err) {
            console.error("Navbar Auth Check error:", err);
        }
      }`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // We need to replace the big block of auth UI logic in every file with a call to initializeGlobalAuth();
  // We can search for the "try {" block inside "DOMContentLoaded" and replace it.
  
  // The try block starts with "try {\n          const {\n            data: { session },"
  // and ends with "} catch (err) {\n          console.error("Navbar Auth Check error:", err);\n        }"
  const regex = /try\s*\{\s*const\s*\{\s*data:\s*\{\s*session\s*\}\s*,?\s*\}\s*=\s*await\s*sb\.auth\.getSession\(\);[\s\S]*?console\.error\("Navbar Auth Check error:",\s*err\);\s*\}/;

  if (regex.test(content)) {
    content = content.replace(regex, 'initializeGlobalAuth();');
    
    // now we need to inject the function definition into the DOMContentLoaded, or outside.
    // let's put it just before DOMContentLoaded.
    content = content.replace('document.addEventListener("DOMContentLoaded", async () => {', sharedAuthLogic + '\\n\\n      document.addEventListener("DOMContentLoaded", async () => {');
    
    // Also we need to make sure we don't duplicate logic.
    fs.writeFileSync(file, content);
  }
});
console.log("Updated files setup");
