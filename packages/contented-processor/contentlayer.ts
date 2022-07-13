import { SourcePlugin } from '@contentlayer/core';
import { makeSource } from 'contentlayer/source-files';

import { getUnifiedBuilder } from './unified';

async function makeConfig(): Promise<SourcePlugin> {
  return makeSource({
    contentDirPath: 'content', // TODO(fuxingloh): get from process.env
    markdown: await getUnifiedBuilder(),
    documentTypes: [
      // require(...) // TODO(fuxingloh): get from process.env
    ],
  });
}

export default makeConfig();
