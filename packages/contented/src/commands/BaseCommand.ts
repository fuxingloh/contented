import { join } from 'node:path';

import { Command } from 'clipanion';

import { ContentedConfig } from '../index.js';

export abstract class BaseCommand extends Command {
  static paths = [[`build`]];

  async loadConfig(): Promise<ContentedConfig> {
    const configPath = join(process.cwd(), 'contented.config.js');
    // eslint-disable-next-line no-console
    console.log(`Loading config from: ${configPath}`);
    const config = await import(configPath);
    return config.default;
  }
}
