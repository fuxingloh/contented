import { defineDocumentType } from '@birthdayresearch/contented-processor';
import { computeLastEditedDate } from '@birthdayresearch/contented-processor/fields/date';
import { computeContentHeadings } from '@birthdayresearch/contented-processor/fields/headings';
import { computePath, computeSections } from '@birthdayresearch/contented-processor/fields/path';

export default defineDocumentType(() => ({
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
    date: computeLastEditedDate('content'),
    sections: computeSections(/posts\/?/g, /\d+:/g, ''),
    contentHeadings: computeContentHeadings(),
  },
}));