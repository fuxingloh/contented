const Doc = {
  name: 'Doc',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the documentation.',
      required: true,
      default: 'Contented',
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
  },
};

export default {
  rootDir: 'docs',
  types: [Doc],
};
