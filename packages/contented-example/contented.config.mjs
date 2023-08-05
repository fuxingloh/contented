import { MarkdownPipeline } from '@contentedjs/contented-pipeline-md';

/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  preview: {
    url: 'https://contented.dev',
    name: 'Contented',
    github: {
      url: 'https://github.com/levaintech/contented',
    },
  },
  processor: {
    pipelines: [
      {
        type: 'Contented',
        pattern: 'docs/**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          tags: {
            type: 'string[]',
          },
          editOnGitHubLink: {
            type: 'string',
            resolve: (_, { file }) => {
              return `https://github.com/levaintech/contented/edit/main/packages/contented-example/${file.data.contented.filePath}`;
            },
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
        pattern: ['contented-example-lorem/**/*.md'],
        processor: MarkdownPipeline,
        transform: (file) => {
          file.path = file.path.replaceAll(/^\/contented-example-lorem\/?/g, '/');
          file.sections = file.sections.slice(1);
          return file;
        },
      },
      {
        type: 'Contented',
        pattern: 'jest/**/*.spec.ts',
        processor: 'jest-md',
        transform: (file) => {
          file.sections = file.sections.slice(1);
          return file;
        },
      },
    ],
  },
};

export default config;
