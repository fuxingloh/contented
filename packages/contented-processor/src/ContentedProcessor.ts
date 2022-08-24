import { ContentedPipeline, FileContent, FileIndex, Pipeline } from '@birthdayresearch/contented-pipeline';
import { MarkdownPipeline } from '@birthdayresearch/contented-pipeline-md';
import minimatch from 'minimatch';
import { join } from 'node:path';

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
    config.rootDir = config.rootDir ?? './';
    config.outDir = config.outDir ?? './.contented';
    config.pipelines.forEach((pipeline) => {
      if (pipeline.type.match(/[^a-zA-Z]/g)) {
        throw new Error(
          'Due to codegen, pipeline.type must be a string with allowed characters within the range of [a-zA-Z].',
        );
      }

      if (pipeline.type.endsWith('Index')) {
        throw new Error('Due to codegen, pipeline.type cannot be Index or end with Index.');
      }
    });

    this.rootPath = join(process.cwd(), config.rootDir);
    this.outPath = join(process.cwd(), config.outDir);
    this.codegen = new ContentedCodegen(this.config, this.outPath);
  }

  async build(...files: string[]): Promise<ContentedProcessorResult> {
    const result: ContentedProcessorResult = {
      pipelines: {},
    };

    for (const file of files) {
      const output = await this.process(file);
      if (output) {
        if (!result.pipelines[output.type]) {
          result.pipelines[output.type] = [];
        }

        result.pipelines[output.type].push({
          fields: output.fields,
          id: output.id,
          modifiedDate: output.modifiedDate,
          path: output.path,
          sections: output.sections,
          type: output.type,
        });
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

  async process(file: string): Promise<FileContent | undefined> {
    const processor = await this.getCachedPipeline(file);
    if (processor === undefined) {
      return;
    }

    const output = await processor.process(this.rootPath, file);
    if (output !== undefined) {
      await this.codegen.generateFile(output);
    }
    return output;
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
    const newPipeline = async (): Promise<ContentedPipeline> => {
      switch (pipeline.processor) {
        case 'md':
          return new MarkdownPipeline(pipeline);
        default:
          return import(pipeline.processor);
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
