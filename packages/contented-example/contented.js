import {
  defineDocumentType,
} from "contentlayer/source-files";

// import { computeContentHeadings } from '@birthdayresearch/contented-processor/fields/headings';
// import { computeLastEditedDate } from '@birthdayresearch/contented-processor/fields/date';
// import { computePath } from '@birthdayresearch/contented-processor/fields/path';
import slugify from "@sindresorhus/slugify";
import { computeContentHeadings } from './headings';
import { computePath, computeSections } from './path';
import { computeLastEditedDate } from './date';

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the documentation.',
      required: true,
      default: 'Contented Documentation',
    },
    description: {
      type: 'string',
      required: false,
    },
  },
  computedFields: {
    path: computePath('/', /\d+:/g, ''),
    // date: computeLastEditedDate('content'),
    sections: computeSections(/docs\/?/g, /\d+:/g, ''),
    contentHeadings: computeContentHeadings(),
  },
}));

/** @type {ContentedConfig} */
export default {
  preview: {
    url: 'https://contented.dev',
    name: 'Contented Documentation',
    github: {
      url: 'https://github.com/BirthdayResearch/contented',
    },
  },
  processor: {
    rootDir: './',
    types: [
      Doc,
    ],
  },
};