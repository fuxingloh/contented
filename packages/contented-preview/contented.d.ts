import { DocumentTypes } from "contentlayer/source-files";

export interface ContentedConfig {
  preview: {
    url?: string;
    name?: string;
    github?: {
      url?: string;
    };
  };
  processor: {
    rootDir: string;
    types: DocumentTypes;
  };
}

export default {} as ContentedConfig;
