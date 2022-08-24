import slugify from '@sindresorhus/slugify';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { join, parse, ParsedPath } from 'node:path';

import { PipelineField } from './PipelineField.js';
import { FileContent, FileIndex } from './PipelineFile.js';

export interface Pipeline {
  type: string;
  pattern: string | string[];
  processor: 'md';
  fields?: {
    [name: string]: PipelineField;
  };
  transform?: (file: FileContent) => Promise<FileContent>;
  sort?: (a: FileIndex, b: FileIndex) => number;
}

/**
 * Contented Pipeline (Path-based)
 */
export abstract class ContentedPipeline {
  public constructor(protected readonly pipeline: Pipeline) {}

  async process(rootPath: string, file: string): Promise<FileContent | undefined> {
    const fileIndex = await this.newFileIndex(rootPath, file);
    const content = await this.processFile(fileIndex, rootPath, file);
    if (content === undefined) {
      return undefined;
    }
    if (this.pipeline.transform === undefined) {
      return undefined;
    }
    return this.pipeline.transform(content);
  }

  abstract processFile(fileIndex: FileIndex, rootPath: string, file: string): Promise<FileContent | undefined>;

  get type() {
    return this.pipeline.type;
  }

  protected sort(files: FileIndex[]): FileIndex[] {
    if (!this.pipeline.sort) {
      return files;
    }
    return files.sort(this.pipeline.sort);
  }

  protected async newFileIndex(rootPath: string, file: string): Promise<FileIndex> {
    const filePath = join(rootPath, file);
    const parsedPath = parse(file);
    const sections = computeSections(parsedPath);

    return {
      id: computeFileId(filePath),
      type: this.type,
      path: computePath(sections, parsedPath),
      modifiedDate: await computeModifiedDate(filePath),
      sections,
      fields: {},
    };
  }
}

function computePath(sections: string[], parsedPath: ParsedPath) {
  const dir = `/${sections.map((s) => slugify(s)).join('/')}`;
  const file = `/${slugify(replacePrefix(parsedPath.name))}`;
  if (file === '/index') {
    return dir;
  }

  if (dir === '/') {
    return file;
  }

  return `${dir}${file}`;
}

function computeFileId(filePath: string) {
  return createHash('sha256').update(filePath).digest('hex');
}

async function computeModifiedDate(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.mtime.getTime();
}

function computeSections(parsedPath: ParsedPath) {
  if (parsedPath.dir === '') {
    return [];
  }

  return parsedPath.dir.split('/').map(replacePrefix);
}

function replacePrefix(path: string) {
  return path.replaceAll(/^:\d+:/g, '');
}
