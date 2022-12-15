import { join } from 'node:path';

import { ContentedPipeline, FileContent, FileIndex } from '@birthdayresearch/contented-pipeline';
import console from 'console';
import { read } from 'to-vfile';
import { Processor, unified } from 'unified';
import { VFile } from 'vfile';

import { UnifiedContented } from './plugins/Plugin.js';
import { initProcessor } from './UnifiedProcessor.js';

export class MarkdownPipeline extends ContentedPipeline {
  protected readonly processor: Processor = unified();

  async init() {
    await initProcessor(this.processor);
  }

  protected override async processFileIndex(
    fileIndex: FileIndex,
    rootPath: string,
    file: string,
  ): Promise<FileContent[]> {
    const vFile = await this.readVFile(rootPath, file);
    if (vFile === undefined) {
      return [];
    }

    vFile.data = { contented: this.newUnifiedContented() };
    const output = await this.processor.process(vFile);
    const contented = output.data.contented as UnifiedContented;

    if (contented.errors.length > 0) {
      const message = contented.errors.map((value) => `${value.type}:${value.reason}`).join(',');
      console.warn(`@birthdayresearch/contented-pipeline-md: ${file} - failed with errors: [${message}]`);
      return [];
    }

    const content = this.newFileContent(fileIndex, output.value as string, contented);
    return [content];
  }

  protected async readVFile(rootPath: string, file: string): Promise<VFile | undefined> {
    return read(join(rootPath, file));
  }

  protected newUnifiedContented(): UnifiedContented {
    return {
      contentedPipeline: this,
      pipeline: this.pipeline,
      headings: [],
      fields: {},
      errors: [],
    };
  }

  protected newFileContent(fileIndex: FileIndex, html: string, contented: UnifiedContented) {
    return {
      ...fileIndex,
      html,
      headings: contented.headings,
      fields: contented.fields,
    };
  }
}
