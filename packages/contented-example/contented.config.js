/** @type {import('@birthdayresearch/contented').ContentedConfig} */
module.exports = {
  preview: {
    url: 'https://contented.dev',
    name: 'Contented',
    github: {
      url: 'https://github.com/BirthdayResearch/contented',
    },
  },
  processor: {
    pipelines: [
      {
        type: 'Doc',
        pattern: '**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
            required: true,
            resolve: (s) => s ?? 'Contented',
          },
          description: {
            type: 'string',
          },
        },
      },
    ],
  },
};