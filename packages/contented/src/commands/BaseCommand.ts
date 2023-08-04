import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { Command } from 'clipanion';

import { ContentedConfig } from '../index.js';

export abstract class BaseCommand extends Command {
  static paths = [[`build`]];

  /**
   * Load the configuration file for Contented.
   * Checks for `contented.config.mjs` or `contented.config.js` in the current working directory.
   *
   * @returns {Promise<ContentedConfig>} A promise that resolves to the loaded configuration object.
   */
  async loadConfig(): Promise<ContentedConfig> {
    let configPath = join(process.cwd(), 'contented.config.mjs');
    if (!existsSync(configPath)) {
      configPath = join(process.cwd(), 'contented.config.js');
    }

    // eslint-disable-next-line no-console
    console.log(`Loading config from: ${configPath}`);
    const config = await import(configPath);
    return config.default;
  }
}
