import { ContentedProcessor } from '@contentedjs/contented-processor';
import { Option } from 'clipanion';

import { BaseCommand } from './BaseCommand.js';
import { ContentedWalker } from './contented/ContentedWalker.js';
import { ContentedWatcher } from './contented/ContentedWatcher.js';

/**
 * `contented build` the dist
 */
export class BuildCommand extends BaseCommand {
  static paths = [[`build`]];

  watch = Option.Boolean(`--watch`, false);

  async execute() {
    const config = await this.loadConfig();
    config.processor.outDir = config.processor.outDir ?? './dist';

    const processor = new ContentedProcessor(config.processor);
    const walker = new ContentedWalker(processor);
    await walker.walk();

    if (this.watch) {
      const watcher = new ContentedWatcher(processor);
      await watcher.watch();
    }
  }
}
