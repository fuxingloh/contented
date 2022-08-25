import 'jest-extended';

import { FileContent, FileIndex } from '@birthdayresearch/contented-pipeline';
import { MarkdownPipeline } from '@birthdayresearch/contented-pipeline-md';

import { Config, ContentedProcessor } from './ContentedProcessor';

describe('process', () => {
  const config: Config = {
    rootDir: './fixtures',
    outDir: './.contented',
    pipelines: [
      {
        type: 'Markdown',
        pattern: '**/*.md',
        processor: 'md',
      },
    ],
  };

  const processor = new ContentedProcessor(config);

  it('should process Foo.Bar.md', async () => {
    expect(await processor.process('Foo.Bar.md')).toStrictEqual({
      type: 'Markdown',
      fields: {},
      headings: [
        {
          children: [],
          depth: 1,
          id: 'what-is-going-on',
          title: 'What is going on',
        },
      ],
      path: '/foo-bar',
      sections: [],
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#what-is-going-on">What is going on</a></li></ol></nav><h1 id="what-is-going-on"><a aria-hidden="true" tabindex="-1" href="#what-is-going-on"><span class="icon icon-link"></span></a>What is going on</h1>\n<p>Markdown for testing <code>ContentedProcessor.unit.ts</code>.</p>',
    });
  });

  it('should process :2:path-1.md', async () => {
    expect(await processor.process(':2:path-1.md')).toStrictEqual({
      type: 'Markdown',
      fields: {},
      headings: [],
      path: '/path-1',
      sections: [],
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"></ol></nav><p>Title</p>',
    });
  });

  it('should process :1:Category/:1:slug.md', async () => {
    expect(await processor.process(':1:Category/:1:slug.md')).toStrictEqual({
      type: 'Markdown',
      fields: {},
      headings: [
        {
          children: [],
          depth: 2,
          id: 'header',
          title: 'Header',
        },
      ],
      path: '/category/slug',
      sections: ['Category'],
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#header">Header</a></li></ol></nav><h2 id="header"><a aria-hidden="true" tabindex="-1" href="#header"><span class="icon icon-link"></span></a>Header</h2>\n<p>Content</p>',
    });
  });

  it('should process :1:Category/Section/:2:path.md', async () => {
    expect(await processor.process(':1:Category/Section/:2:path.md')).toStrictEqual({
      type: 'Markdown',
      fields: {},
      headings: [
        {
          children: [],
          depth: 2,
          id: 'header',
          title: 'Header',
        },
      ],
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#header">Header</a></li></ol></nav><h2 id="header"><a aria-hidden="true" tabindex="-1" href="#header"><span class="icon icon-link"></span></a>Header</h2>\n<p>Content</p>',
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      sections: ['Category', 'Section'],
      path: '/category/section/path',
    });
  });
});

describe('build', () => {
  const config: Config = {
    rootDir: './fixtures',
    outDir: './.contented',
    pipelines: [
      {
        type: 'Markdown',
        pattern: '**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
            required: true,
          },
        },
      },
    ],
  };
  const processor = new ContentedProcessor(config);

  it('should build 2 files', async () => {
    const result = await processor.build(':2:path-1.md', ':1:Category/Section/:2:path.md');
    expect(result).toStrictEqual({
      pipelines: {
        Markdown: [
          {
            fields: {
              title: 'Hello',
            },
            id: expect.stringMatching(/[0-f]{64}/),
            modifiedDate: expect.any(Number),
            path: '/path-1',
            sections: [],
            type: 'Markdown',
          },
          {
            fields: {
              title: 'Path',
            },
            id: expect.stringMatching(/[0-f]{64}/),
            modifiedDate: expect.any(Number),
            path: '/category/section/path',
            sections: ['Category', 'Section'],
            type: 'Markdown',
          },
        ],
      },
    });
  });

  it('should build 4 files', async () => {
    const result = await processor.build(
      ':2:path-1.md',
      'Foo.Bar.md',
      ':1:Category/Section/:2:path.md',
      ':1:Category/:1:slug.md',
    );

    expect(result).toStrictEqual({
      pipelines: {
        Markdown: [
          {
            fields: {
              title: 'Hello',
            },
            id: expect.stringMatching(/[0-f]{64}/),
            modifiedDate: expect.any(Number),
            path: '/path-1',
            sections: [],
            type: 'Markdown',
          },
          {
            fields: {
              title: 'Path',
            },
            id: expect.stringMatching(/[0-f]{64}/),
            modifiedDate: expect.any(Number),
            path: '/category/section/path',
            sections: ['Category', 'Section'],
            type: 'Markdown',
          },
          {
            fields: {
              title: 'Slug',
            },
            id: expect.stringMatching(/[0-f]{64}/),
            modifiedDate: expect.any(Number),
            path: '/category/slug',
            sections: ['Category'],
            type: 'Markdown',
          },
        ],
      },
    });
  });
});

describe('custom', () => {
  class CustomPipeline extends MarkdownPipeline {
    override async processFile(fileIndex: FileIndex): Promise<FileContent | undefined> {
      return {
        ...fileIndex,
        html: '<div>CUSTOM</div>',
        headings: [],
      };
    }
  }

  const config: Config = {
    rootDir: './fixtures',
    outDir: './.contented',
    pipelines: [
      {
        type: 'Custom',
        pattern: '**/*.md',
        processor: CustomPipeline,
      },
    ],
  };
  const processor = new ContentedProcessor(config);

  it('should use custom pipeline', async () => {
    expect(await processor.process(':2:path-1.md')).toStrictEqual({
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      type: 'Custom',
      path: '/path-1',
      sections: [],
      fields: {},
      html: '<div>CUSTOM</div>',
      headings: [],
    });
  });
});

it('should dedup 2 files', async () => {
  const config: Config = {
    rootDir: './fixtures',
    outDir: './.contented',
    pipelines: [
      {
        type: 'Markdown',
        pattern: '**/:1:Category/*.md',
        processor: 'md',
      },
      {
        type: 'Markdown',
        pattern: '**/*.md',
        processor: 'md',
      },
    ],
  };
  const processor = new ContentedProcessor(config);
  await processor.build(':2:path-1.md', ':1:Category/Section/:2:path.md');
});

it('should sort 2 files', async () => {
  const config: Config = {
    rootDir: './fixtures',
    outDir: './.contented',
    pipelines: [
      {
        type: 'Markdown',
        pattern: '**/*.md',
        processor: 'md',
        sort(a) {
          if (a.path === '/category/section/path') {
            return -1;
          }
          return 1;
        },
      },
    ],
  };
  const processor = new ContentedProcessor(config);
  const files = await processor.build(':2:path-1.md', ':1:Category/Section/:2:path.md');
  expect(files.pipelines.Markdown[0]).toMatchObject({
    path: '/category/section/path',
  });
  expect(files.pipelines.Markdown[1]).toMatchObject({
    path: '/path-1',
  });
});
