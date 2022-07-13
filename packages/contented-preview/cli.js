#! /usr/bin/env node
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const commandLineArgs = require("command-line-args");

const mainDefinitions = [{ name: "command", defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});

/**
 * Get contented config from package.json
 * @return {ContentedConfig}
 */
function getContentedConfig() {
  const file = fs.readFileSync(`${process.cwd()}/package.json`);
  if (!file) {
    throw new Error(
      `Unable to load contented config from ${process.cwd()}/package.json`
    );
  }

  const contented = JSON.parse(file)?.contented;
  if (!contented) {
    throw new Error(
      `Unable to load contented config from ${process.cwd()}/package.json`
    );
  }

  return contented;
}

spawn(`npm`, ["run", mainOptions.command, "--prefix", __dirname], {
  stdio: "inherit",
  env: {
    ...process.env,
    CONTENTED_CONFIG: JSON.stringify(getContentedConfig()),
  },
});
