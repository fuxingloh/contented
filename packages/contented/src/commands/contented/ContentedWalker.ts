import { ContentedProcessor, ContentedProcessorResult } from '@contentedjs/contented-processor';
import { BaseContext } from 'clipanion/lib/advanced/Cli';
import walk from 'ignore-walk';

export class ContentedWalker {
  constructor(
    protected readonly context: BaseContext,
    protected processor: ContentedProcessor,
  ) {}

  async walk(): Promise<ContentedProcessorResult> {
    const files = await walk({
      path: this.processor.rootPath,
      ignoreFiles: ['.contentedignore', '.gitignore', '.npmignore'],
    });

    const result: ContentedProcessorResult = await this.processor.build(...files);
    Object.entries(result.pipelines).forEach(([key, value]) => {
      this.context.stdout.write(`Processed ${value.length} files for pipeline "${key}".\n`);
    });
    return result;
  }
}
