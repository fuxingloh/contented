import { ContentedProcessor } from '@contentedjs/contented-processor';
import { Option } from 'clipanion';

import { BaseCommand } from './BaseCommand.js';
import { ContentedPreview } from './contented/ContentedPreview.js';
import { ContentedWalker } from './contented/ContentedWalker.js';
import { ContentedWatcher } from './contented/ContentedWatcher.js';

/**
 * `contented generate` the preview website
 */
export class GenerateCommand extends BaseCommand {
  static paths = [[`generate`]];

  watch = Option.Boolean(`--watch`, false);

  async execute() {
    const config = await this.loadConfig();
    config.processor.outDir = config.processor.outDir ?? '.contented';

    const processor = new ContentedProcessor(config.processor);
    const walker = new ContentedWalker(processor);
    await walker.walk();

    if (this.watch) {
      const watcher = new ContentedWatcher(processor);
      await watcher.watch();
    }

    const preview = new ContentedPreview(config.preview);
    await preview.init();
    await preview.install();

    if (this.watch) {
      await preview.write();
    } else {
      await preview.generate();
    }
  }
}
