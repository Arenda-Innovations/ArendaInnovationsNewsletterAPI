#!/usr/bin/env node
const { spawn } = require('child_process');
const pkg = '@sendgrid/mail';

console.log(`Installing ${pkg}...`);

const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(cmd, ['install', pkg, '--save'], { stdio: 'inherit' });

child.on('close', (code) => {
  if (code === 0) {
    console.log(`${pkg} installed successfully.`);
  } else {
    console.error(`${pkg} install failed with exit code ${code}.`);
  }
  process.exit(code);
});
