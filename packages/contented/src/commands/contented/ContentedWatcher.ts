import { join, relative } from 'node:path';

import { FileContent } from '@contentedjs/contented-pipeline';
import { ContentedProcessorResult } from '@contentedjs/contented-processor';
import watcher, { Event } from '@parcel/watcher';
import debounce from 'debounce';

import { ContentedWalker } from './ContentedWalker.js';

export class ContentedWatcher extends ContentedWalker {
  private result?: ContentedProcessorResult;

  async watch(): Promise<void> {
    await this.processWalk();

    const dotContentedDir = join(relative(this.processor.rootPath, process.cwd()), '.contented');
    const callback = (err: Error | null, events: Event[]) => this.listen(events);
    await watcher.subscribe(this.processor.rootPath, callback, {
      ignore: [dotContentedDir, '**/.contented', '**/node_modules', '**/.turbo', '.git', '.idea', '.vscode'],
    });
  }

  /**
   * Listen to directory changes:
   *  - if a new file is added walk through all files and update index
   *  - if a new file is edited and already indexed, update the single file
   *  - if a new file is edited but not indexed, walk through all files
   */
  private async listen(events: Event[]) {
    const filtered = events.filter((value) => !value.path.endsWith('~'));
    if (filtered.some((value) => value.type !== 'update')) {
      await this.processWalk();
      return;
    }

    for (const event of filtered) {
      for (const content of await this.processFile(event.path)) {
        // TODO: currently this check if it's not indexed, but it doesn't check if it's removed
        if (!this.isIndexed(content)) {
          await this.processWalk();
          return;
        }
      }
    }
  }

  private isIndexed(content: FileContent): boolean {
    if (this.result === undefined) {
      return false;
    }
    return this.result.pipelines[content.type].some((i) => i.fileId === content.fileId);
  }

  private processWalk = debounce(async () => {
    this.result = await this.walk();
  }, 1000);

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
