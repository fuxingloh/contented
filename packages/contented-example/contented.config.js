/** @type {import('@birthdayresearch/contented').ContentedConfig} */
const config = {
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
        type: 'Docs',
        pattern: 'docs/**/*.md',
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
          tags: {
            type: 'string[]',
          },
        },
        transform: (file) => {
          file.path = file.path.replaceAll(/^\/docs\/?/g, '/');
          file.sections = file.sections.slice(1);
          return file;
        },
      },
      {
        type: 'Lorem',
        pattern: 'lorem/**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
          },
        },
        transform: (file) => {
          file.sections = file.sections.slice(1);
          return file;
        },
      },
    ],
  },
};

export default config;