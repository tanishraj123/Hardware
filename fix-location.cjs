const fs = require('fs');
let html = fs.readFileSync('location.html', 'utf8');

// replace saveSelectedLocation
const saveSelectedLogic = /async function saveSelectedLocation[\s\S]*?\}\s*\}\s*\n/s;
html = html.replace(saveSelectedLogic, `async function saveSelectedLocation(lat, lng, locationString) {
  const { data: { user } } = await window.sb.auth.getUser();
  if (!user) {
    showToast("Please sign in or register to set location.", "error");
    return;
  }
  try {
    const { error: updateError } = await window.sb.from('profiles').update({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      location_text: locationString
    }).eq('id', user.id);
    if (!updateError) {
      showToast('Location saved!');
      if (typeof updateLocationDisplay === 'function') {
        const currentProfileState = { latitude: lat, longitude: lng, location_text: locationString };
        updateLocationDisplay(currentProfileState);
      }
    } else {
      showToast('Failed to save selected location.', 'error');
    }
  } catch (err) {
    console.error('Error saving selected location:', err);
    showToast('Failed to save selected location.', 'error');
  }
}
`);

// fix detectLocation signature
html = html.replace('function detectLocation() {', 'async function detectLocation() {');
html = html.replace('if (!currentUser) return;', `const { data: { user } } = await window.sb.auth.getUser();
  if (!user) {
    showToast("Please sign in or register to set location.", "error");
    return;
  }`);

// within detectLocation, fix the update part:
const innerUpdateRegex = /const \{ data: userData, error: userError \} = await sb\.auth\.getUser\(\);[\s\S]*?showToast\("Location saved! We'll find suppliers near you\."\);/s;
html = html.replace(innerUpdateRegex, `const { error: updateError } = await window.sb.from('profiles').update({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              location_text: locationText
            }).eq('id', user.id);
            if (!updateError) {
               showToast('Location saved!');
               if (typeof updateLocationDisplay === 'function') {
                  const currentProfileState = { latitude: lat, longitude: lon, location_text: locationText };
                  updateLocationDisplay(currentProfileState);
               }
            } else {
               showToast('Failed to save location.', 'error');
            }`);

fs.writeFileSync('location.html', html, 'utf8');
console.log('Fixed location');
