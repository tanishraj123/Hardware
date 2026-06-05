const fs = require('fs');

let html = fs.readFileSync('register-company.html', 'utf8');

const regex = /saveCompanyBtn\.addEventListener\('click', async \(\) => \{[\s\S]*?if \(!currentUser\) return;[\s\S]*?try \{[\s\S]*?const updateData = \{([\s\S]*?)\};[\s\S]*?const \{ error: updateError \} = await sb\.from\('profiles'\)\.update\(updateData\)\.eq\('id', currentUser\.id\);[\s\S]*?if \(upsertErr\) throw upsertErr;\n          \}/;

const newLogic = `saveCompanyBtn.addEventListener('click', async () => {
        const { data: userData, error: userError } = await sb.auth.getUser();
        if (userError || !userData?.user) {
          showToast('Please sign in first', 'error');
          return;
        }
        const user = userData.user;

        const company_name = document.getElementById('company-name-input').value.trim();
        const company_website = document.getElementById('company-web-input').value.trim();
        const company_type = document.getElementById('company-type-input').value;
        const company_address = document.getElementById('company-address-input').value.trim();
        const company_products_supplied = document.getElementById('company-products-input').value.trim();

        if (!company_name) {
          showToast('Please specify a Company Name.', 'error');
          return;
        }

        saveCompanyBtn.textContent = 'Saving...';
        saveCompanyBtn.disabled = true;

        try {
          const updateData = {
            company_name,
            company_website,
            company_type,
            company_address,
            company_products_supplied,
            role: 'supplier'
          };

          const { error: updateError } = await sb.from('profiles').update(updateData).eq('id', user.id);
          if (updateError) {
            // Upsert fallback
            const { error: upsertErr } = await sb.from('profiles').upsert({
              id: user.id,
              ...updateData,
              full_name: user.user_metadata?.full_name || user.user_metadata?.first_name || 'GrabRaw Builder'
            });
            if (upsertErr) throw upsertErr;
          }`;

html = html.replace(regex, newLogic);
fs.writeFileSync('register-company.html', html, 'utf8');
