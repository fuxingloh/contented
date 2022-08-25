import { ContentedProcessor } from '@birthdayresearch/contented-processor';
import watcher, { Event } from '@parcel/watcher';
import debounce from 'debounce';
import { join, relative } from 'node:path';

import { BuildCommand } from './BuildCommand.js';

export class WatchCommand extends BuildCommand {
  static paths = [[`watch`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);

    await this.walk(processor);
    await this.subscribe(processor);
  }

  async subscribe(processor: ContentedProcessor) {
    const processWalk = debounce(() => {
      this.walk(processor);
    }, 1000);

    const processFile = (path: string) => {
      const file = relative(processor.rootPath, path);
      processor.process(file).then((content) => {
        if (!content) return;
        console.log(`Processed "${file}" as "${content?.path}"`);
      });
    };

    const subscribe = (err: Error | null, events: Event[]) => {
      const filtered = events.filter((value) => !value.path.endsWith('~'));
      if (filtered.some((value) => value.type !== 'update')) {
        processWalk();
      } else {
        for (const event of filtered) {
          processFile(event.path);
        }
      }
    };

    const relativeDir = relative(processor.rootPath, process.cwd());
    await watcher.subscribe(processor.rootPath, subscribe, {
      ignore: ['.contented', join(relativeDir, '.contented'), 'node_modules', '.git', '.idea', '.vscode'],
    });
  }
}
