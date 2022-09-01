import { ContentedProcessor, ContentedProcessorResult } from '@birthdayresearch/contented-processor';
import walk from 'ignore-walk';

export class ContentedWalker {
  constructor(protected processor: ContentedProcessor) {}

  async walk(): Promise<ContentedProcessorResult> {
    const files = await walk({
      path: this.processor.rootPath,
      ignoreFiles: ['.contentedignore', '.gitignore', '.npmignore'],
    });

    const result: ContentedProcessorResult = await this.processor.build(...files);
    Object.entries(result.pipelines).forEach(([key, value]) => {
      // eslint-disable-next-line no-console
      console.log(`Processed ${value.length} files for pipeline "${key}".`);
    });
    return result;
  }
}
