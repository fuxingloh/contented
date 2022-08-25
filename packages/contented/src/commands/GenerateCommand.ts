import { ContentedProcessor } from '@birthdayresearch/contented-processor';

import { BuildCommand } from './BuildCommand.js';
import { ContentedPreview } from './ContentedPreview.js';

export class GenerateCommand extends BuildCommand {
  static paths = [[`generate`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);
    await this.walk(processor);

    const preview = new ContentedPreview(config.preview);
    await preview.init();
    await preview.install();
    await preview.generate();
  }
}
