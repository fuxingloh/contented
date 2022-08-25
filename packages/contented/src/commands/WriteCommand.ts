import { ContentedPreview } from './ContentedPreview.js';
import { WatchCommand } from './WatchCommand.js';
import { ContentedProcessor } from '@birthdayresearch/contented-processor';

export class WriteCommand extends WatchCommand {
  static paths = [[`write`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);

    await this.walk(processor);
    await this.subscribe(processor);

    const preview = new ContentedPreview(config.preview);
    await preview.init();
    await preview.install();
    await preview.write();
  }
}
