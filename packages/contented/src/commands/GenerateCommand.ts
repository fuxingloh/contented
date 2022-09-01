import { ContentedProcessor } from '@birthdayresearch/contented-processor';

import { BaseCommand } from './BaseCommand.js';
import { ContentedPreview } from './contented/ContentedPreview.js';
import { ContentedWalker } from './contented/ContentedWalker.js';

/**
 * `contented generate` the preview website
 */
export class GenerateCommand extends BaseCommand {
  static paths = [[`generate`]];

  async execute() {
    const config = await this.loadConfig();

    const processor = new ContentedProcessor(config.processor);
    const walker = new ContentedWalker(processor);
    await walker.walk();

    const preview = new ContentedPreview(config.preview);
    await preview.init();
    await preview.install();
    await preview.generate();
  }
}
