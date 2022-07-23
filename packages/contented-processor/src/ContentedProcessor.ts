import { join } from 'node:path';
import minimatch from 'minimatch';
import fs from 'node:fs/promises';
import { ContentedPipeline, MarkdownContentedPipeline, Pipeline } from './pipeline';

export interface Config {
  rootDir: string;
  outDir: string;
  pipelines: Pipeline[];
}

export interface ContentedProcessorResult {}

export class ContentedProcessor {
  public readonly rootPath: string = join(process.cwd(), this.config.rootDir);
  public readonly outPath: string = join(process.cwd(), this.config.rootDir, this.config.outDir);
  private pipelines: Record<string, ContentedPipeline | undefined> = {};

  constructor(protected readonly config: Config) {}

  async build(...files: string[]): Promise<ContentedProcessorResult> {
    for (const file of files) {
      const output = await this.process(file);
      // TODO(fuxingloh): save output
    }

    return {};
  }

  async process(file: string) {
    const processor = await this.getCachedProcessor(file);
    if (processor === undefined) {
      return;
    }

    const output = await processor.process(this.rootPath, file);
    const outPath = join(this.outPath, output.category, `${output.id}.json`);

    await fs.mkdir(join(this.outPath, output.category), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(output));
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

    const processor = this.pipelines[pipeline.category];
    if (processor !== undefined) {
      return processor;
    }

    if (pipeline.processor === 'md') {
      const processor = new MarkdownContentedPipeline(pipeline);
      await processor.init();
      this.pipelines[pipeline.category] = processor;
      return processor;
    }

    throw new Error(`pipeline.category: ${pipeline.category} processor not found.`);
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
