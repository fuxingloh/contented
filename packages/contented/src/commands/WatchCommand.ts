import { BuildCommand } from './BuildCommand.js';
import { ContentedProcessor } from '@birthdayresearch/contented-processor';
import chokidar from 'chokidar';
import { relative } from 'path';
import debounce from 'debounce';

export class WatchCommand extends BuildCommand {
  static paths = [[`watch`]];

  async execute() {
    const config = await this.loadConfig();
    const processor: ContentedProcessor = new ContentedProcessor(config.processor);
    const watcher = createWatcher(processor);

    await this.walk(processor);

    const processWalk = debounce(() => {
      this.walk(processor);
    }, 3000);

    const processFile = (path: string) => {
      const file = relative(processor.rootPath, path);
      processor.process(file).then((content) => {
        if (!content) return;
        console.log(`Processed "${file}" as "${content?.path}"`);
      });
    };

    watcher.on('change', processFile).on('add', processWalk).on('unlink', processWalk);
  }
}

function createWatcher(processor: ContentedProcessor) {
  return chokidar.watch(processor.rootPath, {
    persistent: true,
    awaitWriteFinish: true,
    ignoreInitial: true,
    ignored: /(^|[\/\\])\../, // ignore dotfiles
  });
}
