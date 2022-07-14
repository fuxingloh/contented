import { DocumentTypes } from "contentlayer/source-files";

export interface ContentedPreview {
  url?: string;
  name?: string;
  github?: {
    url?: string;
  };
}

export interface ContentedConfig {
  rootDir: string;
  types: DocumentTypes;
}

export default {} as ContentedConfig;
