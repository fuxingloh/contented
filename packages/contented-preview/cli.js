#! /usr/bin/env node
const { cpSync } = require('node:fs');

const contentedDir = `${process.cwd()}/.contented/.preview`;

cpSync(`${__dirname}`, contentedDir, {
  recursive: true,
});
