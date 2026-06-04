const fs = require('fs');
let content = fs.readFileSync('profile.html', 'utf8');

const providerLogicRegex = /\/\/ Set Account Provider label nicely[\s\S]*?providerBadge\.textContent = 'Email Account';\n\s*\}/;

const newProviderLogic = `// Set Account Provider label nicely
        if (provider === 'google') {
          providerBadge.innerHTML = '<span style="color: #4285F4; font-weight: bold; margin-right: 4px;">G</span> Google Account';
          providerBadge.style.backgroundColor = '#ffffff';
          providerBadge.style.border = '1px solid #dadce0';
          providerBadge.style.color = '#3c4043';
          
          if (user.user_metadata?.avatar_url) {
            avatarContainer.innerHTML = '<img src="' + user.user_metadata.avatar_url + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;" alt="Google Profile Photo" />';
          }
          
          const signedInP = document.createElement('div');
          signedInP.textContent = 'Signed in with Google';
          signedInP.style.fontSize = '12px';
          signedInP.style.color = '#5f6368';
          signedInP.style.marginTop = '4px';
          fullNameEl.parentNode.insertBefore(signedInP, fullNameEl.nextSibling);
          
          const headings = document.querySelectorAll('.section-heading');
          headings.forEach(heading => {
             if (heading.textContent.includes('Phone Number')) {
                heading.parentNode.style.display = 'none';
             }
          });
        } else {
          providerBadge.textContent = '✉ Email Account';
          providerBadge.style.backgroundColor = '#f1f3f4';
          providerBadge.style.border = '1px solid transparent';
          providerBadge.style.color = '#5f6368';
        }`;

if (providerLogicRegex.test(content)) {
  content = content.replace(providerLogicRegex, newProviderLogic);
  fs.writeFileSync('profile.html', content);
  console.log("Updated profile.html");
} else {
  console.error("Could not find provider logic to replace");
}
