import { ContentedProcessor } from '@birthdayresearch/contented-processor';
import { spawnSync } from 'node:child_process';

import { BuildCommand } from './BuildCommand.js';

export class GenerateCommand extends BuildCommand {
  static paths = [[`generate`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);
    await this.walk(processor);

    spawnSync(`contented-preview`, [], { stdio: 'inherit' });

    const previewDir = `${process.cwd()}/.contented/.preview`;
    spawnSync(`npm`, ['run', 'export', '--prefix', previewDir], {
      stdio: 'inherit',
      cwd: previewDir,
    });
  }
}
