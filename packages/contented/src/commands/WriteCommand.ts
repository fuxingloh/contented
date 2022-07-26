import { WatchCommand } from './WatchCommand.js';
import { ContentedPreview } from './ContentedPreview.js';

export class WriteCommand extends WatchCommand {
  static paths = [[`write`]];

  async execute() {
    await super.execute();

    const preview = new ContentedPreview();
    await preview.init();
    await preview.install();
    await preview.write();
  }
}
