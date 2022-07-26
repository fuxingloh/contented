import slugify from '@sindresorhus/slugify';
import * as console from 'console';
import { createHash } from 'crypto';
import fs from 'node:fs/promises';
import { join, parse, ParsedPath } from 'node:path';
import { read } from 'to-vfile';
import { Processor, unified, VFileWithOutput } from 'unified';

import { initProcessor, UnifiedContented } from './ContentedUnified.js';
import { PipelineField } from './unified/fields/Fields.js';
import { ContentHeading } from './unified/rehype/Heading.js';

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
 * FileIndex without html, saved in an index.
 */
export interface FileIndex {
  id: string;
  path: string;
  type: string;
  sections: string[];
  modifiedDate: number;
  fields: Record<string, any>;
}

/**
 * FileContent with html, saved as individual file.
 */
export interface FileContent extends FileIndex {
  html: string;
  headings: ContentHeading[];
}

export abstract class ContentedPipeline {
  protected readonly processor: Processor = unified();

  constructor(protected readonly pipeline: Pipeline) {}

  abstract process(rootPath: string, file: string): Promise<FileContent | undefined>;

  get type() {
    return this.pipeline.type;
  }

  sort(files: FileIndex[]): FileIndex[] {
    if (!this.pipeline.sort) {
      return files;
    }
    return files.sort(this.pipeline.sort);
  }
}

export class MarkdownContentedPipeline extends ContentedPipeline {
  async init() {
    await initProcessor(this.processor);
  }

  async process(rootPath: string, file: string): Promise<FileContent | undefined> {
    const filePath = join(rootPath, file);
    const output = await this.processUnified(filePath);

    const parsedPath = parse(file);
    const sections = computeSections(parsedPath);
    const contented = output.data.contented as UnifiedContented;

    if (contented.errors.length > 0) {
      const message = contented.errors.map((value) => `${value.type}:${value.reason}`).join(',');
      console.warn(`@birthdayresearch/contented-processor: ${file} - failed with errors: [${message}]`);
      return undefined;
    }

    const content = {
      id: computeFileId(filePath),
      type: this.pipeline.type,
      modifiedDate: await computeModifiedDate(filePath),
      path: computePath(sections, parsedPath),
      sections,
      html: output.value as string,
      fields: contented.fields,
      headings: contented.headings,
    };

    return (await this.pipeline.transform?.(content)) ?? content;
  }

  async processUnified(filePath: string): Promise<VFileWithOutput<any>> {
    const vFile = await read(filePath);
    const contented: UnifiedContented = {
      pipeline: this.pipeline,
      headings: [],
      fields: {},
      errors: [],
    };
    vFile.data = { contented };
    return this.processor.process(vFile);
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

function computeSections(parsedPath: ParsedPath) {
  if (parsedPath.dir === '') {
    return [];
  }

  return parsedPath.dir.split('/').map(replacePrefix);
}

async function computeModifiedDate(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.mtime.getTime();
}

function replacePrefix(path: string) {
  return path.replaceAll(/^:\d+:/g, '');
}
