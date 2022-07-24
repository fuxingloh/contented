import { ContentedProcessor } from '@birthdayresearch/contented-processor';
import { Command } from 'clipanion';
import { join } from 'node:path';

export class BuildCommand extends Command {
  static paths = [[`build`]];

  async execute() {
    const processor = await loadProcessor();
    console.log(processor.rootPath)
  }
}

async function loadProcessor(): Promise<ContentedProcessor> {
  const configPath = join(process.cwd(), 'contented.config.js');
  console.log(`Loading config from: ${configPath}`);

  const config = await import(configPath);
  return new ContentedProcessor(config.default.processor);
}