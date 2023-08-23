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
    rootDir: '../../',
    pipelines: [
      {
        type: 'Contented',
        pattern: 'README.md',
        processor: 'md',
        fields: {
          editOnGitHubLink: {
            type: 'string',
            resolve: () => {
              return `https://github.com/levaintech/contented/edit/main/README.md`;
            },
          },
        },
        transform: (file) => {
          file.path = '/about';
          return file;
        },
      },
      {
        type: 'Contented',
        dir: 'packages/contented-example/docs',
        pattern: '**/*.md',
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
              return `https://github.com/levaintech/contented/edit/main/packages/contented-example/docs/${file.data.contented.filePath}`;
            },
          },
        },
        sort: (a, b) => {
          const sections = a.path.split('/').length - b.path.split('/').length;
          if (sections === 0) {
            return a.path.localeCompare(b.path);
          }
          return sections;
        },
      },
      {
        type: 'Lorem',
        dir: 'packages/contented-example',
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
        dir: 'packages/contented-example',
        pattern: 'jest/**/*.md.unit.[tj]s',
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
