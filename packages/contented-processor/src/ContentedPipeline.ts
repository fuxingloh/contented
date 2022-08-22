import { Processor, unified } from 'unified';

import { PipelineField } from './markdown/fields/Fields.js';
import { ContentHeading } from './markdown/rehype/Heading.js';

export interface Pipeline {
  type: string;
  pattern: string | string[];
  processor: 'md';
  fields?: {
    [name: string]: PipelineField;
  };
  transform?: (file: FileContent) => Promise<FileContent>;
  sort?: (a: FileIndex, b: FileIndex) => number;
}

/**
 * FileIndex without html, saved in an index.
 */
export interface FileIndex {
  id: string;
  path: string;
  type: string;
  sections: string[];
  modifiedDate: number;
  fields: Record<string, any>;
}

/**
 * FileContent with html, saved as individual file.
 */
export interface FileContent extends FileIndex {
  html: string;
  headings: ContentHeading[];
}

export abstract class ContentedPipeline {
  protected readonly processor: Processor = unified();

  constructor(protected readonly pipeline: Pipeline) {}

  abstract process(rootPath: string, file: string): Promise<FileContent | undefined>;

  get type() {
    return this.pipeline.type;
  }

  sort(files: FileIndex[]): FileIndex[] {
    if (!this.pipeline.sort) {
      return files;
    }
    return files.sort(this.pipeline.sort);
  }
}
