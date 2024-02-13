import { spawn, spawnSync } from 'node:child_process';
import { cpSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as process from 'node:process';
import { fileURLToPath } from 'node:url';

import { PreviewConfig } from '../../index.js';

export class ContentedPreview {
  protected readonly config: PreviewConfig;

  previewDir = `${process.cwd()}/.contented/.preview`;

  constructor(config?: PreviewConfig) {
    if (config === undefined) {
      throw new Error('ContentedConfig.preview is required');
    }
    this.config = config;
  }

  async init() {
    const source = join(this.getDirname(), '/../../.preview');
    cpSync(source, this.previewDir, { recursive: true });
    writeFileSync(join(this.previewDir, '.env'), generateEnvData(this.config));
  }

  async install() {
    spawnSync(`npm`, ['i'], {
      stdio: 'inherit',
      cwd: this.previewDir,
    });
  }

  async write() {
    spawn(`npm`, ['run', 'dev'], {
      stdio: 'inherit',
      cwd: this.previewDir,
    });
  }

  async generate() {
    spawnSync(`npm`, ['run', 'export'], {
      stdio: 'inherit',
      cwd: this.previewDir,
    });
  }

  getDirname() {
    return dirname(fileURLToPath(import.meta.url));
  }
}

function generateEnvData(preview: PreviewConfig): string {
  return [
    `CONTENTED_PREVIEW_SITE_URL=${preview.url ?? 'https://contented.fuxing.dev'}`,
    `CONTENTED_PREVIEW_SITE_NAME=${preview?.name ?? 'Contented'}`,
    `CONTENTED_PREVIEW_GITHUB_URL=${preview?.github?.url ?? 'https://github.com/fuxingloh/contented'}`,
  ].join('\n');
}
