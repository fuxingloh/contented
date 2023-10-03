import console from 'node:console';
import { join } from 'node:path';

import { ContentedPipeline, FileContent, FileIndex, Pipeline } from '@contentedjs/contented-pipeline';
import { read } from 'to-vfile';
import { Processor, unified } from 'unified';
import { VFile } from 'vfile';

import { UnifiedContented } from './plugins/Plugin.js';
import { initProcessor } from './UnifiedProcessor.js';

export class MarkdownPipeline extends ContentedPipeline {
  protected readonly processor: Processor = unified();

  async init() {
    initProcessor(this.processor);
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

    const fileContent = await this.processVFile(fileIndex, vFile);
    if (fileContent === undefined) {
      return [];
    }

    return [fileContent];
  }

  protected async readVFile(rootPath: string, filePath: string): Promise<MarkdownVFile | undefined> {
    const vFile = await read(join(rootPath, filePath));
    return new MarkdownVFile(vFile, this, filePath);
  }

  protected async processVFile(fileIndex: FileIndex, vFile: MarkdownVFile): Promise<FileContent | undefined> {
    const output = await this.processor.process(vFile);
    const contented = output.data.contented as UnifiedContented;

    if (contented.errors.length > 0) {
      const message = contented.errors.map((value) => `${value.type}:${value.reason}`).join(',');
      console.warn(`@contentedjs/contented-pipeline-md: ${vFile.filePath} - failed with errors: [${message}]`);
      return undefined;
    }

    return {
      ...fileIndex,
      html: output.value as string,
      headings: contented.headings,
      fields: contented.fields,
    };
  }

  /**
   * Create a new MarkdownPipeline with a custom processor.
   * This is useful for only using a subset of the plugins that you need.
   * @param processor is a function that takes a Processor and adds plugins to it.
   */
  static withProcessor(
    processor: (processor: Processor) => void,
  ): new (rootPath: string, pipeline: Pipeline) => ContentedPipeline {
    class WithProcessor extends MarkdownPipeline {
      async init(): Promise<void> {
        processor(this.processor);
      }
    }

    return WithProcessor;
  }
}

export class MarkdownVFile extends VFile {
  data: {
    contented: UnifiedContented;
  };

  constructor(
    value: ConstructorParameters<typeof VFile>[0],
    contentedPipeline: MarkdownPipeline,
    public readonly filePath: string,
  ) {
    super(value);
    this.data = {
      contented: {
        contentedPipeline,
        pipeline: contentedPipeline.pipeline,
        headings: [],
        fields: {},
        errors: [],
        filePath,
      },
    };
  }
}
