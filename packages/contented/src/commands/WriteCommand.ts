import { ContentedProcessor } from '@birthdayresearch/contented-processor';

import { BaseCommand } from './BaseCommand.js';
import { ContentedPreview } from './contented/ContentedPreview.js';
import { ContentedWalker } from './contented/ContentedWalker.js';
import { ContentedWatcher } from './contented/ContentedWatcher.js';

/**
 * `contented write` to watch files and automatically rebuild when changed into output directory `.contented`
 * with a preview website
 */
export class WriteCommand extends BaseCommand {
  static paths = [[`write`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);

    const walker = new ContentedWalker(processor);
    const watcher = new ContentedWatcher(processor);

    await walker.walk();
    await watcher.watch();

    const preview = new ContentedPreview(config.preview);
    await preview.init();
    await preview.install();
    await preview.write();
  }
}
