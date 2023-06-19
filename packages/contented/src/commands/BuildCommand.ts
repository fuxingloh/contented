import { ContentedProcessor } from '@contentedjs/contented-processor';

import { BaseCommand } from './BaseCommand.js';
import { ContentedWalker } from './contented/ContentedWalker.js';

/**
 * `contented build` the dist
 */
export class BuildCommand extends BaseCommand {
  static paths = [[`build`]];

  async execute() {
    const config = await this.loadConfig();
    config.processor.outDir = config.processor.outDir ?? './dist';

    const processor = new ContentedProcessor(config.processor);
    const walker = new ContentedWalker(processor);
    await walker.walk();
  }
}
