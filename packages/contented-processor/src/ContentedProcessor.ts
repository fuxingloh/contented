import { join } from 'node:path';

import { ContentedPipeline, FileContent, FileIndex, Pipeline } from '@contentedjs/contented-pipeline';
import { JestMarkdownPipeline } from '@contentedjs/contented-pipeline-jest-md';
import { MarkdownPipeline } from '@contentedjs/contented-pipeline-md';
import minimatch from 'minimatch';

import { ContentedCodegen } from './ContentedCodegen.js';

export interface Config {
  /**
   * The root directory of your contented markdown.
   */
  rootDir?: string;
  /**
   * Customize the output path. Editing this will cause contented-preview to break.
   */
  outDir?: string;
  /**
   * Contented processing pipeline
   */
  pipelines: Pipeline[];
}

export interface ContentedProcessorResult {
  pipelines: Record<string, FileIndex[]>;
}

export class ContentedProcessor {
  public readonly rootPath: string;

  public readonly outPath: string;

  public readonly codegen: ContentedCodegen;

  public pipelines: Record<string, ContentedPipeline> = {};

  constructor(protected readonly config: Config) {
    /* eslint-disable  no-param-reassign */
    config.rootDir = config.rootDir ?? './';
    config.outDir = config.outDir ?? './.contented';
    config.pipelines.forEach((pipeline) => {
      pipeline.type = pipeline.type ?? 'Default';
      if (pipeline.type.match(/[^a-zA-Z]/g)) {
        throw new Error(
          'Due to codegen, pipeline.type must be a string with allowed characters within the range of [a-zA-Z].',
        );
      }

      if (pipeline.type.endsWith('Index')) {
        throw new Error('Due to codegen, pipeline.type cannot be Index or end with Index.');
      }
    });
    /* eslint-enable  no-param-reassign */

    this.rootPath = join(process.cwd(), config.rootDir);
    this.outPath = join(process.cwd(), config.outDir);
    this.codegen = new ContentedCodegen(this.config, this.outPath);
  }

  async build(...files: string[]): Promise<ContentedProcessorResult> {
    const result: ContentedProcessorResult = {
      pipelines: Object.fromEntries(this.config.pipelines.map((p) => [p.type, []])),
    };

    for (const file of files) {
      for (const content of await this.process(file)) {
        result.pipelines[content.type].push(cloneFileIndex(content));
      }
    }

    // eslint-disable-next-line guard-for-in
    for (const type in result.pipelines) {
      const sortedFiles = this.findPipelineByType(type)!.sort(result.pipelines[type]);
      await this.codegen.generatePipeline(type, sortedFiles);
    }

    await this.codegen.generateIndex();
    return result;
  }

  async process(file: string): Promise<FileContent[]> {
    const processor = await this.getCachedPipeline(file);
    if (processor === undefined) {
      return [];
    }

    const contents = await processor.process(this.rootPath, file);
    for (const content of contents) {
      await this.codegen.generateFile(content);
    }
    return contents;
  }

  /**
   * Find the cached pipeline to use
   */
  async getCachedPipeline(file: string): Promise<ContentedPipeline | undefined> {
    const filePath = join(this.rootPath, file);
    const pipeline = this.findPipelineByFile(filePath);
    if (!pipeline) {
      return undefined;
    }

    const cacheKey = getPipelineUniqueKey(pipeline);
    if (this.pipelines[cacheKey] === undefined) {
      this.pipelines[cacheKey] = await this.newProcessor(pipeline);
    }

    return this.pipelines[cacheKey];
  }

  private async newProcessor(pipeline: Pipeline): Promise<ContentedPipeline> {
    const newPipeline = (): ContentedPipeline => {
      switch (pipeline.processor) {
        case 'md':
          return new MarkdownPipeline(this.rootPath, pipeline);
        case 'jest-md':
          return new JestMarkdownPipeline(this.rootPath, pipeline);
        default:
          // eslint-disable-next-line new-cap
          return new pipeline.processor(this.rootPath, pipeline);
      }
    };

    const processor = await newPipeline();
    if (processor) {
      await processor.init();
      return processor;
    }

    throw new Error(`pipeline.category: ${pipeline.type} processor not found.`);
  }

  /**
   * First the first pipeline to use
   */
  private findPipelineByFile(filePath: string) {
    return this.config.pipelines.find((pipeline) => {
      if (typeof pipeline.pattern === 'string') {
        return minimatch(filePath, join(this.rootPath, pipeline.pattern));
      }

      for (const pattern of pipeline.pattern) {
        const matched = minimatch(filePath, join(this.rootPath, pattern));
        if (matched) {
          return true;
        }
      }

      return false;
    });
  }

  private findPipelineByType(type: string) {
    return Object.values(this.pipelines).find((pipeline) => pipeline.type === type);
  }
}

function getPipelineUniqueKey(pipeline: Pipeline) {
  if (typeof pipeline.pattern === 'string') {
    return `${pipeline.type}:${pipeline.pattern}`;
  }

  return `${pipeline.type}:${pipeline.pattern.join(',')}`;
}

function cloneFileIndex(index: FileIndex) {
  return {
    fields: index.fields,
    id: index.id,
    modifiedDate: index.modifiedDate,
    path: index.path,
    sections: index.sections,
    type: index.type,
  };
}
