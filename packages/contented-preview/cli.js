#! /usr/bin/env node
const { symlinkSync, existsSync, rmSync, cpSync } = require("node:fs");
const { spawn } = require("node:child_process");
const commandLineArgs = require("command-line-args");

const mainDefinitions = [{ name: "command", defaultOption: true }];
const { command } = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});

const path = `${__dirname}/contented.js`;
const target = `${process.cwd()}/contented.js`;
if (existsSync(path)) {
  rmSync(path);
}
symlinkSync(target, path, "file");

spawn(`npm`, ["run", command, "--prefix", __dirname], {
  stdio: "inherit",
  cwd: __dirname,
  env: {
    ...process.env,
    CONTENTED_CWD: process.cwd(),
  },
});

if (command === "build") {
  cpSync(`${__dirname}/.contentlayer/generated`, `${process.cwd()}/dist`, {
    recursive: true,
  });
}
