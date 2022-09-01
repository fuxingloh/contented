import { ContentedProcessor } from '@birthdayresearch/contented-processor';

import { BaseCommand } from './BaseCommand.js';
import { ContentedWalker } from './contented/ContentedWalker.js';
import { ContentedWatcher } from './contented/ContentedWatcher.js';

/**
 * `contented watch` files and automatically rebuild when changed into output directory `.contented`
 */
export class WatchCommand extends BaseCommand {
  static paths = [[`watch`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);

    const walker = new ContentedWalker(processor);
    const watcher = new ContentedWatcher(processor);

    await walker.walk();
    await watcher.watch();
  }
}
