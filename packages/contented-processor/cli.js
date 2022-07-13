#! /usr/bin/env node
const { spawn } = require('node:child_process');
const commandLineArgs = require('command-line-args');

const mainDefinitions = [
  { name: 'command', defaultOption: true },
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });

if (mainOptions.command === 'build') {
  console.log('build');
}