import { ContentedProcessor, Config } from './ContentedProcessor';

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

describe('process single files', function () {
  it('should process Foo.Bar.md', async function () {
    const processor = new ContentedProcessor(config);
    expect(await processor.process('Foo.Bar.md')).toStrictEqual({
      category: 'Markdown',
      fields: {},
      headings: [],
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#what-is-going-on">What is going on</a></li></ol></nav><h1 id="what-is-going-on"><a aria-hidden="true" tabindex="-1" href="#what-is-going-on"><span class="icon icon-link"></span></a>What is going on</h1>\n<p>Markdown for testing <code>ContentedProcessor.unit.ts</code>.</p>',
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      path: '1',
    });
  });

  it('should process :2:path-1.md', async function () {
    const processor = new ContentedProcessor(config);
    expect(await processor.process(':2:path-1.md')).toStrictEqual({
      category: 'Markdown',
      fields: {},
      headings: [],
      html: '<nav class="toc"><ol class="toc-level toc-level-1"></ol></nav>',
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      path: '1',
    });
  });

  it('should process :1:Category/:1:slug.md', async function () {
    const processor = new ContentedProcessor(config);
    expect(await processor.process(':1:Category/:1:slug.md')).toStrictEqual({
      category: 'Markdown',
      fields: {},
      headings: [],
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#header">Header</a></li></ol></nav><h2 id="header"><a aria-hidden="true" tabindex="-1" href="#header"><span class="icon icon-link"></span></a>Header</h2>\n<p>Content</p>',
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      path: '1',
    });
  });

  it('should process :1:Category/Section/:2:path.md', async function () {
    const processor = new ContentedProcessor(config);
    expect(await processor.process(':1:Category/Section/:2:path.md')).toStrictEqual({
      category: 'Markdown',
      type: 'Markdown',
      fields: {
        title: 'Path',
      },
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

describe('build', function () {
  const processor = new ContentedProcessor(config);

  it('should build', async function () {
    const result = await processor.build(':2:path-1.md', 'Foo.Bar.md');
  });
});
