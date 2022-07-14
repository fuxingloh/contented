import { join } from 'node:path';
import { makeSource } from 'contentlayer/source-files';

// noinspection JSFileReferences
import contented from '../contented';

async function makeConfig() {
  return makeSource({
    contentDirPath: join('../', contented.rootDir),
    markdown: await contented.unified(),
    documentTypes: contented.types,
    contentDirExclude: ['dist', '.next', 'out', '.contented'],
    onUnknownDocuments: 'skip-ignore',
    disableImportAliasWarning: true,
  });
}

export default makeConfig();
