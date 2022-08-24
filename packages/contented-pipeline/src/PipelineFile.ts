/**
 * PipelineFile, AKA pre-processed file.
 */
export interface PipelineFile {
  id: string;
  type: string;
}

/**
 * FileIndex without html, saved in an index.json file.
 */
export interface FileIndex extends PipelineFile {
  path: string;
  sections: string[];
  modifiedDate: number;
  fields: Record<string, any>;
}

/**
 * FileContent with html, saved as individual file.
 */
export interface FileContent extends FileIndex {
  html: string;
  headings: FileContentHeadings[];
}

/**
 * Included in FileContent, content 'headings'.
 */
export interface FileContentHeadings {
  id: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  children: FileContentHeadings[];
}
