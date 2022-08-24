import { ContentedPipeline, FileContent, FileIndex } from '@birthdayresearch/contented-pipeline';
import console from 'console';
import { join } from 'node:path';
import { read } from 'to-vfile';
import { Processor, unified, VFileWithOutput } from 'unified';

import { UnifiedContented } from './plugins/Plugin.js';
import { initProcessor } from './UnifiedProcessor.js';

export class MarkdownPipeline extends ContentedPipeline {
  protected readonly processor: Processor = unified();

  async init() {
    await initProcessor(this.processor);
  }

  protected override async processFile(
    fileIndex: FileIndex,
    rootPath: string,
    file: string,
  ): Promise<FileContent | undefined> {
    const output = await this.processUnified(rootPath, file);
    const contented = output.data.contented as UnifiedContented;

    if (contented.errors.length > 0) {
      const message = contented.errors.map((value) => `${value.type}:${value.reason}`).join(',');
      console.warn(`@birthdayresearch/contented-pipeline-md: ${file} - failed with errors: [${message}]`);
      return undefined;
    }

    return {
      ...fileIndex,
      html: output.value as string,
      headings: contented.headings,
      fields: contented.fields,
    };
  }

  protected async processUnified(rootPath: string, file: string): Promise<VFileWithOutput<any>> {
    const vFile = await read(join(rootPath, file));
    vFile.data = { contented: this.newUnifiedContented() };
    return this.processor.process(vFile);
  }

  protected newUnifiedContented(): UnifiedContented {
    return {
      pipeline: this.pipeline,
      headings: [],
      fields: {},
      errors: [],
    };
  }
}
