import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cp } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';

export class ContentedPreview {
  previewDir = `${process.cwd()}/.contented/.preview`;

  async init() {
    const source = join(this.getDirname(), '/../.preview');
    await cp(source, this.previewDir, { recursive: true });
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
