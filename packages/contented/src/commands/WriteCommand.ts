import { spawn, spawnSync } from 'node:child_process';

import { WatchCommand } from './WatchCommand.js';

export class WriteCommand extends WatchCommand {
  static paths = [[`write`]];

  async execute() {
    await super.execute();

    spawnSync(`contented-preview`);

    const previewDir = `${process.cwd()}/.contented/.preview`;
    spawn(`npm`, ['run', 'dev', '--prefix', previewDir], {
      stdio: 'inherit',
      cwd: previewDir,
    });
  }
}
