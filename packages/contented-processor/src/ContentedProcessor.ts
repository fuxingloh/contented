import minimatch from 'minimatch';
import { join } from 'node:path';

import { ContentedCodegen } from './ContentedCodegen.js';
import { ContentedPipeline, FileContent, FileIndex, MarkdownContentedPipeline, Pipeline } from './ContentedPipeline.js';

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

  public pipelines: Record<string, ContentedPipeline | undefined> = {};

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
      await this.codegen.generatePipeline(type, result.pipelines[type]);
    }

    await this.codegen.generateIndex();
    return result;
  }

  async process(file: string): Promise<FileContent | undefined> {
    const processor = await this.getCachedProcessor(file);
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
   * Find the cached processor to use
   */
  async getCachedProcessor(file: string): Promise<ContentedPipeline | undefined> {
    const filePath = join(this.rootPath, file);
    const pipeline = this.getPipeline(filePath);
    if (!pipeline) {
      return undefined;
    }

    const cacheKey = getPipelineUniqueKey(pipeline);
    const processor = this.pipelines[cacheKey];
    if (processor !== undefined) {
      return processor;
    }

    if (pipeline.processor === 'md') {
      const mdProcessor = new MarkdownContentedPipeline(pipeline);
      await mdProcessor.init();
      this.pipelines[cacheKey] = mdProcessor;
      return mdProcessor;
    }

    throw new Error(`pipeline.category: ${pipeline.type} processor not found.`);
  }

  /**
   * First the first pipeline to use
   */
  private getPipeline(filePath: string) {
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
}

function getPipelineUniqueKey(pipeline: Pipeline) {
  if (typeof pipeline.pattern === 'string') {
    return `${pipeline.type}:${pipeline.pattern}`;
  }

  return `${pipeline.type}:${pipeline.pattern.join(',')}`;
}
