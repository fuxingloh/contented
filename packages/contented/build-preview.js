#! /usr/bin/env node
import { cpSync } from 'node:fs';
import { join } from 'node:path';

const files = ['src', 'next.config.js', 'package.json', 'postcss.config.js', 'tailwind.config.js'];

for (const file of files) {
  const source = join(process.cwd(), '/../contented-preview', file);
  const target = join(process.cwd(), '/dist/.preview', file);
  cpSync(source, target, { recursive: true });
}
