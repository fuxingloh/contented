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

it('should process RemarkFrontmatter.md', async () => {
  const content = await pipeline.process(rootPath, 'RemarkFrontmatter.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        title: 'Remark Frontmatter',
        description:
          'This is a test file with frontmatter where title and description will automatically be extracted if they are present and not explicitly set in the --- configuration. This is useful for SEO purposes where descriptions and titles are important but n...',
      },
      headings: expect.any(Array),
      sections: [],
      path: '/remark-frontmatter',
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: expect.any(String),
    },
  ]);
});
