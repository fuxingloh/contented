#! /usr/bin/env node
const { cpSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const commandLineArgs = require('command-line-args');

const mainDefinitions = [{ name: 'command', defaultOption: true }];
const { command } = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});

const contentedDir = `${process.cwd()}/.contented`;

cpSync(`${__dirname}`, contentedDir, {
  recursive: true,
});

spawnSync(`npm`, ['run', command, '--prefix', contentedDir], {
  stdio: 'inherit',
  cwd: contentedDir,
});

if (command === 'build') {
  cpSync(`${contentedDir}/.contentlayer/generated`, `${process.cwd()}/dist`, {
    recursive: true,
  });
}