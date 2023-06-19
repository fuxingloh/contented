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
