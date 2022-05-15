
const { exec } = require('node:child_process');
exec('caddy run', {cwd: 'c:\\caddy\\'}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});