import minimatch from 'minimatch';
import { join } from 'node:path';
import { ContentedCodegen } from './ContentedCodegen.js';
import { ContentedPipeline, FileContent, FileIndex, MarkdownContentedPipeline, Pipeline } from './ContentedPipeline.js';

export interface Config {
  rootDir?: string;
  outDir?: string;
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
    if (output) {
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

    const processor = this.pipelines[pipeline.type];
    if (processor !== undefined) {
      return processor;
    }

    if (pipeline.processor === 'md') {
      const processor = new MarkdownContentedPipeline(pipeline);
      await processor.init();
      this.pipelines[pipeline.type] = processor;
      return processor;
    }

    throw new Error(`pipeline.category: ${pipeline.type} processor not found.`);
  }

  /**
   * First the first pipeline to use
   */
  private getPipeline(filePath: string) {
    return this.config.pipelines.find((pipeline) => {
      const pattern = join(this.rootPath, pipeline.pattern);
      return minimatch(filePath, pattern);
    });
  }
}
