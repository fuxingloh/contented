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
    types: string[];
  };
}
