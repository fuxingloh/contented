export interface ContentedPreview {
  url?: string;
  name?: string;
  github?: {
    url?: string;
  };
}

export interface ContentedConfig {
  /**
   * The root directory of your contented markdown. You can specify a sub-path.
   */
  rootDir: string;

  /**
   * Customizing the unified processor.
   */
  unified?: () => Promise<unified.Processor>;

  /**
   * Defining Contentlayer DocumentTypes.
   */
  types: import('contentlayer/source-files').DocumentTypes;
}

export default {} as ContentedConfig;
