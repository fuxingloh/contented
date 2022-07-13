#! /usr/bin/env node
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const commandLineArgs = require('command-line-args');

const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });

/**
 * Get contented config from package.json
 */
function getContentedConfig() {
  const file = fs.readFileSync(`${process.cwd()}/package.json`);
  if (file === undefined) {
    console.error('Unable to load contented config from package.json', `${process.cwd()}/package.json`);
    return;
  }

  const contented = JSON.parse(file)?.contented;
  if (contented === undefined) {
    console.error('Unable to load contented config from package.json', `${process.cwd()}/package.json`);
    return;
  }

  return contented;
}

spawn(`npm`, ['run', mainOptions.command, '--prefix', __dirname], {
  stdio: 'inherit'
});