import { createHash } from 'crypto';
import { unified, VFileWithOutput, Processor } from 'unified';
import { read } from 'to-vfile';
import { VFile } from 'vfile';
import { initProcessor } from '../unified';
import { Config } from '../ContentedProcessor';
import * as stream from 'stream';
import fs from 'node:fs/promises';
import { join, parse, ParsedPath } from 'node:path';
import slugify from '@sindresorhus/slugify';
import { ContentHeading } from '../unified/rehype/Heading';

export interface Pipeline {
  category: string;
  pattern: string;
  processor: 'md';
  fields?: {
    [name: string]: string;
  };
}

/**
 * FileIndex without html, saved in an index.
 */
export interface FileIndex {
  id: string;
  path: string;
  category: string;
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

  abstract process(rootPath: string, file: string): Promise<FileContent>;
}

export class MarkdownContentedPipeline extends ContentedPipeline {
  async init() {
    await initProcessor(this.processor);
  }

  async process(rootPath: string, file: string): Promise<FileContent> {
    const filePath = join(rootPath, file);
    const output = await this.processOutput(filePath);
    const parsedPath = parse(file);

    const sections = parsedPath.dir.split('/').map(replacePrefix);

    const contented: any = output.data.contented;

    return {
      id: computeFileId(filePath),
      category: this.pipeline.category,
      modifiedDate: await computeModifiedDate(filePath),
      path: `/${sections.map((s) => slugify(s)).join('/')}/${slugify(replacePrefix(parsedPath.name))}`,
      sections: sections,
      fields: contented.fields ?? {},
      html: output.value as string,
      headings: contented.headings ?? [],
    };
  }

  async processOutput(filePath: string): Promise<VFileWithOutput<any>> {
    const vFile = await read(filePath);
    return await this.processor.process(vFile);
  }
}

function computeFileId(filePath: string) {
  return createHash('sha256').update(filePath).digest('hex');
}

async function computeModifiedDate(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.mtime.getTime();
}

function replacePrefix(path: string) {
  return path.replaceAll(/^:\d+:/g, '');
}
