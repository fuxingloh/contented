import slugify from '@sindresorhus/slugify';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { join, parse, ParsedPath } from 'node:path';

import { PipelineField } from './PipelineField.js';
import { FileContent, FileIndex } from './PipelineFile.js';

export interface Pipeline {
  type: string;
  pattern: string | string[];
  /**
   * Built in processor: 'md'
   * Otherwise it will `import(processor)` module with default exporting ContentedPipeline
   */
  processor: 'md' | 'jest-md' | (new (rootPath: string, pipeline: Pipeline) => ContentedPipeline);
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
  public constructor(protected readonly rootPath: string, protected readonly pipeline: Pipeline) {
    // eslint-disable-next-line  no-param-reassign
    pipeline.fields = {
      title: { type: 'string' },
      description: { type: 'string' },
      ...pipeline.fields,
    };
  }

  /**
   * Optional init for Pipeline that require async setup.
   */
  async init(): Promise<void> {} // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * @param {string} rootPath
   * @param {string} file to process
   * @return {FileContent[]} containing none, one or many FileContent
   */
  async process(rootPath: string, file: string): Promise<FileContent[]> {
    const fileIndex = await this.newFileIndex(rootPath, file);
    const contents = await this.processFileIndex(fileIndex, rootPath, file);
    if (contents === undefined) {
      return [];
    }
    if (this.pipeline.transform === undefined) {
      return contents;
    }
    return Promise.all(contents.map(this.pipeline.transform));
  }

  protected abstract processFileIndex(fileIndex: FileIndex, rootPath: string, file: string): Promise<FileContent[]>;

  get type(): string {
    return this.pipeline.type;
  }

  sort(files: FileIndex[]): FileIndex[] {
    if (!this.pipeline.sort) {
      return files;
    }
    return files.sort(this.pipeline.sort);
  }

  protected async newFileIndex(rootPath: string, file: string): Promise<FileIndex> {
    const filePath = join(rootPath, file);
    const parsedPath = parse(file);
    const sections = this.computeSections(parsedPath);

    return {
      id: this.computeFileId(filePath),
      type: this.type,
      path: this.computePath(sections, parsedPath),
      modifiedDate: await this.computeModifiedDate(filePath),
      sections,
      fields: {},
    };
  }

  protected computePath(sections: string[], parsedPath: ParsedPath) {
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

  protected computeFileId(filePath: string) {
    return createHash('sha256').update(filePath).digest('hex');
  }

  protected computeSections(parsedPath: ParsedPath) {
    if (parsedPath.dir === '') {
      return [];
    }

    return parsedPath.dir.split('/').map(replacePrefix);
  }

  protected async computeModifiedDate(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.mtime.getTime();
  }
}

function replacePrefix(path: string) {
  return path.replaceAll(/^(:\d+:|\(\d+\)|\[\d+])/g, '');
}
