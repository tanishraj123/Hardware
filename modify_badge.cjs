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
files.forEach(file => {
  let content = require('fs').readFileSync(file, 'utf8');
  content = content.replace(/\\n/g, '\\n'); // this won't work perfectly on the whole file, wait
});


const badgeCSS = `
    /* GrabRaw+ CSS */
    .plus-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: #4285F4;
      border-radius: 50%;
      color: white;
      font-size: 10px;
      font-weight: bold;
      margin-left: 4px;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .avatar-wrapper { position: relative; display: inline-block; }
    .avatar-badge { position: absolute; bottom: -2px; right: -2px; }
`;

const replaceWith = "if (user) {\\n" +
"          let isPlus = false;\\n" +
"          if (window.GRABRAW_IS_PLUS !== undefined) {\\n" +
"             isPlus = window.GRABRAW_IS_PLUS;\\n" +
"          } else {\\n" +
"             try {\\n" +
"                const { data } = await sb.from('profiles').select('plan').eq('id', user.id).single();\\n" +
"                if (data && typeof data.plan === 'string' && (data.plan.includes('+') || data.plan.toLowerCase().includes('plus'))) {\\n" +
"                  isPlus = true;\\n" +
"                }\\n" +
"             } catch(e) {}\\n" +
"             window.GRABRAW_IS_PLUS = isPlus; // Ensure it's globally available\\n" +
"          }\\n" +
"\\n" +
"          const navActions = document.querySelector('.nav-actions');\\n" +
"          if (navActions) {\\n" +
"            const email = user.email || '';\\n" +
"            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';\\n" +
"            const initial = name ? name.charAt(0).toUpperCase() : '?';\\n" +
"            const avatar = user.user_metadata?.avatar_url;\\n" +
"            \\n" +
"            const badgeHtml = isPlus ? '<div class=\"avatar-badge plus-badge\" title=\"GrabRaw+ Member\">✦</div>' : '';\\n" +
"\\n" +
"            navActions.innerHTML = `\\n" +
"              <div class=\"user-profile-menu-container\" style=\"position: relative;\">\\n" +
"                <button id=\"account-btn\" class=\"btn\" style=\"border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 16px; cursor: pointer; transition: all 0.2s ease; height: 40px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); text-decoration: none;\">\\n" +
"                  <span style=\"font-size: 14px; font-weight: 600;\">My Account</span>\\n" +
"                  <div class=\"avatar-wrapper\">\\n" +
"                    ${avatar ? `<img src=\"${avatar}\" style=\"width: 32px; height: 32px; border-radius: 50%; object-fit: cover;\" alt=\"Avatar\" />` : `<div style=\"background-color: #4285F4; color: #ffffff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; text-transform: uppercase;\">${initial}</div>`}${badgeHtml}\\n" +
"                  </div>\\n" +
"                </button>\\n" +
"                <div id=\"account-dropdown\" style=\"display: none; position: absolute; right: 0; top: calc(100% + 8px); background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 220px; min-width: 200px; z-index: 1000; overflow: hidden; padding: 12px 0; text-align: left;\">\\n" +
"                  <div style=\"padding: 12px 16px; border-bottom: 1px solid #e0e0e0; margin-bottom: 4px; pointer-events: none; user-select: text;\">\\n" +
"                    <div style=\"font-size: 11px; font-weight: 500; color: #70757a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;\">Signed in as</div>\\n" +
"                    <div style=\"display: flex; align-items: center;\">\\n" +
"                       <span style=\"font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;\" title=\"${email}\">${email}</span>\\n" +
"                       ${isPlus ? '<span class=\"plus-badge\" style=\"margin-left: 6px; flex-shrink: 0; position: static; box-shadow: none; border: none;\" title=\"GrabRaw+ Member\">✦</span>' : ''}\\n" +
"                    </div>\\n" +
"                    ${isPlus ? '<div style=\"font-size: 11px; font-weight: 600; color: #4285F4; margin-top: 4px;\">⭐ GrabRaw+ Member</div>' : ''}\\n" +
"                  </div>\\n" +
"                  <a href=\"profile.html\" class=\"dropdown-item\">Profile</a>\\n" +
"                  <a href=\"location.html\" class=\"dropdown-item\">My Location</a>\\n" +
"                  <a href=\"my-partners.html\" class=\"dropdown-item\">My Partner</a>\\n" +
"                  <a href=\"register-company.html\" class=\"dropdown-item\">Register Company</a>\\n" +
"                  <a href=\"#\" id=\"signout-link\" class=\"dropdown-item\" style=\"color: #d93025 !important; font-weight: 600; border-top: 1px solid #e0e0e0; margin-top: 8px; padding-top: 12px;\">Sign Out</a>\\n" +
"                </div>\\n" +
"              </div>\\n" +
"            `;";

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('.plus-badge {')) {
    content = content.replace('</style>', badgeCSS + '\n  </style>');
  }

  const regex = /if \(user\) \{\s*const navActions = document\.querySelector\('\.nav-actions'\);\s*if \(navActions\) \{\s*const email = user\.email \|\| '';\s*const name = user\.user_metadata\?\.full_name \|\| user\.user_metadata\?\.name \|\| user\.email \|\| '';\s*const initial = name \? name\.charAt\(0\)\.toUpperCase\(\) : '\?';\s*const avatar = user\.user_metadata\?\.avatar_url;\s*navActions\.innerHTML = `[\s\S]*?<div style="font-size: 13px; font-weight: 600; color: #1a1a1a; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="\$\{email\}">\$\{email\}<\/div>[\s\S]*?`;/g;

  content = content.replace(regex, replaceWith);

  fs.writeFileSync(file, content);
});
console.log("Applied badge");
