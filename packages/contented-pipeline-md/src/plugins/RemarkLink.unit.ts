import { join } from 'node:path';

import { beforeAll, expect, it } from '@jest/globals';

import { MarkdownPipeline } from '../MarkdownPipeline';

const rootPath = join(__dirname, '../../fixtures');

const pipeline = new MarkdownPipeline(__dirname, {
  type: 'Markdown',
  pattern: ['/20-Heading/*.md', '/01-RemarkLinked.md', '/RemarkLink.md'],
  processor: 'md',
});

beforeAll(async () => {
  await pipeline.init();
});

it('should process RemarkLink.md', async () => {
  const content = await pipeline.process(rootPath, 'RemarkLink.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        title: 'RemarkLink.ts',
        description: 'RemarkLink.ts will automatically link to other markdown files in your repository.',
      },
      headings: expect.any(Array),
      sections: [],
      path: '/remark-link',
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#remarklinkts">RemarkLink.ts</a><ol class="toc-level toc-level-2"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#test-links">Test Links</a></li></ol></li></ol></nav><h1 id="remarklinkts"><a aria-hidden="true" tabindex="-1" href="#remarklinkts"><span class="icon icon-link"></span></a><code>RemarkLink.ts</code></h1>\n<p><code>RemarkLink.ts</code> will automatically link to other markdown files in your repository.</p>\n<h2 id="test-links"><a aria-hidden="true" tabindex="-1" href="#test-links"><span class="icon icon-link"></span></a>Test Links</h2>\n<ul>\n<li><a href="heading/remark-linked">20-Heading/100-RemarkLinked.md</a></li>\n<li><a href="remark-linked">01-RemarkLinked.md</a></li>\n<li><a href="remark-link">RemarkLink.md</a></li>\n<li><a href="https://contented.dev" rel="nofollow" target="_blank">Contented</a></li>\n<li><a href="heading/remark-linked">20-Heading/100-RemarkLinked.md</a></li>\n<li><a href="heading/section-title/deep-link">20-Heading/40-Section Title/200-DeepLink.md</a></li>\n<li><a href="remark-linked">01-RemarkLinked.md</a></li>\n</ul>',
    },
  ]);
});

it('should process 01-RemarkLinked.md', async () => {
  const content = await pipeline.process(rootPath, '01-RemarkLinked.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        description: '20-Heading/100-RemarkLinked.md',
        title: undefined,
      },
      headings: [],
      path: '/remark-linked',
      sections: [],
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"></ol></nav><ul>\n<li><a href="heading/remark-linked">20-Heading/100-RemarkLinked.md</a></li>\n<li><a href="remark-linked">01-RemarkLinked.md</a></li>\n<li><a href="remark-link">RemarkLink.md</a></li>\n</ul>',
    },
  ]);
});

it('should process 20-Heading/100-RemarkLinked.md', async () => {
  const content = await pipeline.process(rootPath, '20-Heading/100-RemarkLinked.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        description: '/20-Heading/100-RemarkLinked.md',
        title: undefined,
      },
      headings: [],
      path: '/heading/remark-linked',
      sections: ['Heading'],
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html:
        '<nav class="toc"><ol class="toc-level toc-level-1"></ol></nav>' +
        '<ul>\n' +
        '<li><a href="remark-linked">/20-Heading/100-RemarkLinked.md</a></li>\n' +
        '<li><a href="../remark-linked">/01-RemarkLinked.md</a></li>\n' +
        '<li><a href="../remark-link">/RemarkLink.md</a></li>\n' +
        '</ul>',
    },
  ]);
});

it('should process 20-Heading/30-Section/100-DeepLink.md', async () => {
  const content = await pipeline.process(rootPath, '20-Heading/30-Section/100-DeepLink.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        description: '/20-Heading/30-Section/100-DeepLink.md',
        title: undefined,
      },
      headings: [],
      path: '/heading/section/deep-link',
      sections: ['Heading', 'Section'],
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html:
        '<nav class="toc"><ol class="toc-level toc-level-1"></ol></nav><ul>\n' +
        '<li><a href="deep-link">/20-Heading/30-Section/100-DeepLink.md</a></li>\n' +
        '<li><a href="../remark-linked">/20-Heading/100-RemarkLinked.md</a></li>\n' +
        '<li><a href="../../remark-linked">/01-RemarkLinked.md</a></li>\n' +
        '<li><a href="../../remark-link">/RemarkLink.md</a></li>\n' +
        '</ul>',
    },
  ]);
});
