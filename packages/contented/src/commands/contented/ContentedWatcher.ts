import { FileContent } from '@birthdayresearch/contented-pipeline';
import watcher, { Event } from '@parcel/watcher';
import { relative } from 'node:path';

import { ContentedWalker } from './ContentedWalker.js';

export class ContentedWatcher extends ContentedWalker {
  async watch(): Promise<void> {
    const listen = (err: Error | null, events: Event[]) => {
      const filtered = events.filter((value) => !value.path.endsWith('~'));
      if (filtered.some((value) => value.type !== 'update')) {
        this.walk();
      } else {
        for (const event of filtered) {
          // TODO(fuxingloh): when a file generate multi FileContent, it should automatically refresh index
          this.processFile(event.path);
        }
      }
    };

    const dotContentedDir = relative(this.processor.rootPath, process.cwd());
    await watcher.subscribe(this.processor.rootPath, listen, {
      ignore: [dotContentedDir, '.contented', 'node_modules', '.git', '.idea', '.vscode'],
    });
  }

  private async processFile(path: string): Promise<FileContent[]> {
    const file = relative(this.processor.rootPath, path);
    const contents = await this.processor.process(file);
    contents.forEach((content) => {
      // eslint-disable-next-line no-console
      console.log(`Processed "${file}" as "${content?.path}"`);
    });
    return contents;
  }
}
