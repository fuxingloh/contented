import { join } from 'node:path';
import { makeSource } from 'contentlayer/source-files';

// noinspection JSFileReferences
import contented from '../contented';

import {
  defineDocumentType,
  getUnifiedProcessor,
  computeContentHeadings,
  computePath,
  computeSections,
} from '@birthdayresearch/contented-processor/src';

const defaultFields = {
  title: {
    type: 'string',
    required: false,
  },
  description: {
    type: 'string',
    required: false,
  },
  tags: {
    type: 'list',
    of: { type: 'string' },
    default: [],
    required: false,
  },
};

const defaultComputedFields = {
  path: computePath('/', /\d+:/g, ''),
  sections: computeSections(undefined, /\d+:/g, ''),
  contentHeadings: computeContentHeadings(),
};

async function makeConfig() {
  const types = contented.types.map((type) => {
    return defineDocumentType(() => {
      return {
        ...type,
        fields: {
          ...defaultFields,
          ...type.fields ?? {},
        },
        computedFields: {
          ...type.documentTypes ?? {},
          ...defaultComputedFields,
        },
      };
    });
  });

  const processor = await (contented.unified?.() ?? getUnifiedProcessor());

  return makeSource({
    contentDirPath: join('../', contented.rootDir),
    markdown: processor,
    documentTypes: types,
    contentDirExclude: ['dist', '.next', 'out', '.contented', 'node_modules'],
    onUnknownDocuments: 'skip-ignore',
    disableImportAliasWarning: true,
  });
}

export default makeConfig();
