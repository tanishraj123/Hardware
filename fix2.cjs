const fs = require('fs');

let html = fs.readFileSync('location.html', 'utf8');

// Replace the detectLocation success logic
const detectRegex = /const \{ error: updateError \} = await sb\.from\('profiles'\)\.update\(updateData\)\.eq\('id', currentUser\.id\);[\s\S]*?if \(upsertErr\) throw upsertErr;\n            \}/;

const newDetectLogic = `const { data: userData, error: userError } = await sb.auth.getUser();
            if (userError || !userData?.user) throw new Error('Not authenticated');
            const user = userData.user;

            const { error: updateError } = await sb.from('profiles').update(updateData).eq('id', user.id);
            if (updateError) {
              const { error: upsertErr } = await sb.from('profiles').upsert({
                id: user.id,
                latitude: lat,
                longitude: lon,
                location_text: locationText,
                full_name: user.user_metadata?.full_name || user.user_metadata?.first_name || 'GrabRaw Builder',
                role: user.user_metadata?.role || 'builder'
              });
              if (upsertErr) throw upsertErr;
            }`;

html = html.replace(detectRegex, newDetectLogic);

// Replace saveSelectedLocation logic
const saveRegex = /const \{ error: updateError \} = await sb\.from\('profiles'\)\.update\(updateData\)\.eq\('id', currentUser\.id\);[\s\S]*?if \(upsertErr\) throw upsertErr;\n        \}/;

const newSaveLogic = `const { data: userData, error: userError } = await sb.auth.getUser();
        if (userError || !userData?.user) throw new Error('Not authenticated');
        const user = userData.user;

        const { error: updateError } = await sb.from('profiles').update(updateData).eq('id', user.id);
        if (updateError) {
          const { error: upsertErr } = await sb.from('profiles').upsert({
            id: user.id,
            latitude: lat,
            longitude: lon,
            location_text: locationText,
            full_name: user.user_metadata?.full_name || user.user_metadata?.first_name || 'GrabRaw Builder',
            role: user.user_metadata?.role || 'builder'
          });
          if (upsertErr) throw upsertErr;
        }`;

html = html.replace(saveRegex, newSaveLogic);

fs.writeFileSync('location.html', html, 'utf8');
