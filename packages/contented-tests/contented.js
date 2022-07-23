module.exports = {
  preview: {
    url: 'https://contented.dev',
    name: 'Contented',
    github: {
      url: 'https://github.com/BirthdayResearch/contented',
    },
  },
  processor: {
    rootDir: './',
    pipeline: {
      Markdown: {
        pattern: '**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
            required: true,
            resolve: (title) => 'Contented',
          },
          description: {
            type: 'string',
            required: false,
          },
        },
      },
    },
  },
};