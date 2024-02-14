import * as process from 'node:process';

import { Config as ProcessorConfig } from '@contentedjs/contented-processor';
import { Cli } from 'clipanion';

import { BaseCommand } from './commands/BaseCommand';
import { BuildCommand } from './commands/BuildCommand.js';
import { GenerateCommand } from './commands/GenerateCommand.js';
import { WriteCommand } from './commands/WriteCommand.js';

export * from '@contentedjs/contented-processor';

export interface PreviewConfig {
  url?: string;
  name?: string;
  github?: {
    url?: string;
  };
}

export interface ContentedConfig {
  preview?: PreviewConfig;
  processor: ProcessorConfig;
}

/**
 * Programmatic API for Contented
 * To be used together in a website project like next.config.js.
 */
/* eslint-disable import/no-default-export */
export default {
  /**
   * import contented from '@contentedjs/contented';
   * await contented.build()
   */
  async build({ watch = process.env.NODE_ENV === 'development' } = {}): Promise<void> {
    const build = new BuildCommand();
    build.context = Cli.defaultContext;
    build.watch = watch;
    await build.execute();
  },
  /**
   * import contented from '@contentedjs/contented';
   * await contented.preview()
   */
  async preview({ watch = process.env.NODE_ENV === 'development' } = {}): Promise<void> {
    const command: BaseCommand = watch ? new WriteCommand() : new GenerateCommand();
    command.context = Cli.defaultContext;
    await command.execute();
  },
};
