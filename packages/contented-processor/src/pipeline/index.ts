import { createHash } from 'crypto';
import { unified, VFileWithOutput, Processor } from 'unified';
import { read } from 'to-vfile';
import { initProcessor } from '../unified';
import fs from 'node:fs/promises';
import { join, parse, ParsedPath } from 'node:path';
import slugify from '@sindresorhus/slugify';
import { ContentHeading } from '../unified/rehype/Heading';

export interface Pipeline {
  type: string;
  pattern: string;
  processor: 'md';
  fields?: {
    [name: string]: string;
    // TODO(fuxingloh): fields processing
  };
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
      type: this.pipeline.type,
      modifiedDate: await computeModifiedDate(filePath),
      path: computePath(sections, parsedPath),
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

function computePath(sections: string[], parsedPath: ParsedPath) {
  const dir = `/${sections.map((s) => slugify(s)).join('/')}`;
  const file = `/${slugify(replacePrefix(parsedPath.name))}`;
  if (file === '/index') {
    return dir;
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

function replacePrefix(path: string) {
  return path.replaceAll(/^:\d+:/g, '');
}
