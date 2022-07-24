import { WatchCommand } from './WatchCommand.js';
import { spawnSync } from 'node:child_process';

export class WriteCommand extends WatchCommand {
  static paths = [[`write`]];

  async execute() {
    await super.execute();

    spawnSync(`contented-preview`, [], { stdio: 'inherit' });

    const previewDir = `${process.cwd()}/.contented/.preview`;
    spawnSync(`npm`, ['run', 'dev', '--prefix', previewDir], {
      stdio: 'inherit',
      cwd: previewDir,
    });
  }
}
