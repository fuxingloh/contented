import { Config as ProcessorConfig } from '@birthdayresearch/contented-processor';

export * from '@birthdayresearch/contented-processor';

export interface PreviewConfig {
  url?: string;
  name?: string;
  github?: {
    url?: string;
  };
}

export interface ContentedConfig {
  preview: PreviewConfig;
  processor: ProcessorConfig;
}
