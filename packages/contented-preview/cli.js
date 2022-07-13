#! /usr/bin/env node
const { spawn } = require('node:child_process');
const commandLineArgs = require('command-line-args');

const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});

spawn(`npm`, ['run', mainOptions.command, '--prefix', __dirname], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CONTENTED_CWD: process.cwd(),
  },
});
