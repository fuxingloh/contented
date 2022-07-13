import { SourcePlugin } from "@contentlayer/core";
import {
  defineDocumentType,
  DocumentTypes,
  makeSource,
} from "contentlayer/source-files";

import { getUnifiedBuilder } from "./unified";

export interface ContentedProcessorConfig {
  rootDir: string;
  types: DocumentTypes;
}

async function defineConfig(
  config: ContentedProcessorConfig
): Promise<SourcePlugin> {
  return makeSource({
    contentDirPath: config.rootDir,
    markdown: await getUnifiedBuilder(),
    documentTypes: config.types,
  });
}

export { defineConfig, defineDocumentType, getUnifiedBuilder, makeSource };
