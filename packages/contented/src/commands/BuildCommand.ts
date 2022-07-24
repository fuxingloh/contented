import { ContentedProcessor, ContentedProcessorResult } from '@birthdayresearch/contented-processor';
import { Command } from 'clipanion';
import { join } from 'node:path';
import { ContentedConfig } from '../index';
import walk from 'ignore-walk';

export class BuildCommand extends Command {
  static paths = [[`build`]];

  async execute() {
    const config = await this.loadConfig();
    const processor = new ContentedProcessor(config.processor);
    await this.walk(processor);
  }

  async walk(processor: ContentedProcessor): Promise<ContentedProcessorResult> {
    const files = await walk({
      path: processor.rootPath,
      ignoreFiles: ['.contentedignore', '.gitignore', '.npmignore'],
    });

    const result: ContentedProcessorResult = await processor.build(...files);
    Object.entries(result.pipelines).forEach(([key, value]) => {
      console.log(`Processed ${value.length} files for pipeline "${key}".`);
    });
    return result;
  }

  async loadConfig(): Promise<ContentedConfig> {
    const configPath = join(process.cwd(), 'contented.config.js');
    console.log(`Loading config from: ${configPath}`);
    const config = await import(configPath);
    return config.default;
  }
}
