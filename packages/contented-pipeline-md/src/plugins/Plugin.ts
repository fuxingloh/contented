import { FileContentHeadings, Pipeline } from '@birthdayresearch/contented-pipeline';

/**
 * UnifiedData passed to unified plugins.
 */
export interface UnifiedContented {
  pipeline: Pipeline;
  headings: FileContentHeadings[];
  fields: { [key: string]: any };
  errors: {
    type: string;
    reason: string;
  }[];
}
