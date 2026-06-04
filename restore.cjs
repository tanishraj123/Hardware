const fs = require('fs');
['info.html', 'location.html', 'my-partners.html', 'profile.html', 'register-company.html', 'index.html'].forEach(file => {
  if (fs.existsSync('dist/' + file)) {
    fs.copyFileSync('dist/' + file, file);
    console.log('Restored ' + file);
  }
});
