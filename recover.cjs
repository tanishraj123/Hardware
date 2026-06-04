const { execSync } = require('child_process');
console.log(execSync('git checkout .').toString());
