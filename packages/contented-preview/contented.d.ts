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
  unified(): Promise<unified.Processor>;
  types: DocumentTypes;
}

export default {} as ContentedConfig;
