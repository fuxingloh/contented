import { ContentedPreview } from './ContentedPreview.js';
import { WatchCommand } from './WatchCommand.js';

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
