import { SourcePlugin } from '@contentlayer/core';
import { defineDocumentType , makeSource } from 'contentlayer/source-files';

import { getUnifiedBuilder } from './unified';

export { defineDocumentType };

async function makeConfig(): Promise<SourcePlugin> {
  return makeSource({
    contentDirPath: './',
    markdown: await getUnifiedBuilder(),
    documentTypes: [
      // require(...)
    ],
  });
}


export default makeConfig();
