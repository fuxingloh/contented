import { ContentedPipeline, FileContentHeadings, Pipeline } from '@contentedjs/contented-pipeline';

/**
 * UnifiedData passed to unified plugins.
 */
export interface UnifiedContented {
  pipeline: Pipeline;
  contentedPipeline: ContentedPipeline;
  headings: FileContentHeadings[];
  fields: { [key: string]: any };
  errors: {
    type: string;
    reason: string;
  }[];
}
