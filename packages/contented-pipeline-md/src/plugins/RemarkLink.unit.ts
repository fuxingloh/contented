import { join } from 'node:path';

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
        description: undefined,
        title: undefined,
      },
      headings: [],
      path: '/remark-link',
      sections: [],
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html:
        '<nav class="toc"><ol class="toc-level toc-level-1"></ol></nav><ul>\n' +
        '<li><a href="heading/remark-linked">20-Heading/100-RemarkLinked.md</a></li>\n' +
        '<li><a href="remark-linked">01-RemarkLinked.md</a></li>\n' +
        '<li><a href="remark-link">RemarkLink.md</a></li>\n' +
        '<li><a href="https://contented.dev" target="_blank" rel="nofollow">Contented</a></li>\n' +
        '</ul>',
    },
  ]);
});

it('should process 01-RemarkLinked.md', async () => {
  const content = await pipeline.process(rootPath, '01-RemarkLinked.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        description: undefined,
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
        description: undefined,
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
        description: undefined,
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
