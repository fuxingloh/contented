import { ContentedField } from './fields';
import { join } from 'node:path';
import minimatch from 'minimatch';
import fs from 'node:fs/promises';
import { createHash } from 'crypto';
import { createUnifiedProcessorRunner, UnifiedProcessor, UnifiedProcessorRunner } from './unified';
import * as console from 'console';

export interface ContentedProcessorConfig {
  rootDir: string;
  outDir: string;
  pipeline: ContentedPipeline[];
}

export interface ContentedPipeline {
  name: string;
  pattern: string;
  processor: UnifiedProcessor;
  fields?: {
    [name: string]: ContentedField
  };
}

export interface ContentedProcessorResult {

}

export class ContentedProcessor {
  public readonly rootPath: string = join(process.cwd(), this.config.rootDir);
  public readonly outPath: string = join(process.cwd(), this.config.rootDir, this.config.outDir);
  private processor: Record<string, UnifiedProcessorRunner | undefined> = {};

  constructor(readonly config: ContentedProcessorConfig) {
    for (const pipeline of config.pipeline) {

    }
  }

  async build(...files: string[]): Promise<ContentedProcessorResult> {
    for (const file of files) {
      const filePath = join(this.rootPath, file);
      const pipeline = this.findPipeline(filePath);

      if (pipeline) {
        await this.processFile(pipeline, filePath);
      }
    }

    return {};
  }

  async processFile(pipeline: ContentedPipeline, filePath: string) {
    const processor = await this.findProcessor(pipeline);
    const fileOutPath = join(this.outPath, generateId(filePath));
    const out = await processor(filePath);
    console.log(out);
  }



  async findProcessor(pipeline: ContentedPipeline): Promise<UnifiedProcessorRunner> {
    let runner = this.processor[pipeline.name];
    if (runner) {
      return runner;
    }

    runner = await createUnifiedProcessorRunner(pipeline.processor);
    if (!runner) {
      throw new Error(`pipeline.name: ${pipeline.name} processor not found.`);
    }
    this.processor[pipeline.name] = runner;
    return runner;
  }

  /**
   * First the first pipeline to use
   */
  findPipeline(filePath: string) {
    return this.config.pipeline.find(pipeline => {
      const pattern = join(this.rootPath, pipeline.pattern);
      return minimatch(filePath, pattern);
    });
  }
}

function generateId(filePath: string) {
  return createHash('sha256').update(filePath).digest('hex');
}
