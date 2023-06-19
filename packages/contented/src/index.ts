import { Config as ProcessorConfig } from '@contentedjs/contented-processor';

export * from '@contentedjs/contented-processor';

export interface PreviewConfig {
  url?: string;
  name?: string;
  github?: {
    url?: string;
  };
}

export interface ContentedConfig {
  preview?: PreviewConfig;
  processor: ProcessorConfig;
}
