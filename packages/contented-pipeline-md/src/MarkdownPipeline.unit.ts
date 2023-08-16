import { join } from 'node:path';

import { MarkdownPipeline } from './MarkdownPipeline';

const rootPath = join(__dirname, '../fixtures');

describe('Without Config', () => {
  const pipeline = new MarkdownPipeline(__dirname, {
    type: 'Markdown',
    pattern: '/See.Nothing.md',
    processor: 'md',
  });

  beforeAll(async () => {
    await pipeline.init();
  });

  it('should process See.Nothing.md', async () => {
    const content = await pipeline.process(rootPath, 'See.Nothing.md');
    expect(content).toStrictEqual([
      {
        type: 'Markdown',
        fields: {
          description: 'Markdown for testing MarkdownPipeline.unit.ts.',
          title: 'Nothing To See',
        },
        headings: [
          {
            depth: 1,
            headingId: 'nothing-to-see',
            title: 'Nothing To See',
            children: [],
          },
        ],
        path: '/see-nothing',
        sections: [],
        fileId: expect.stringMatching(/[0-f]{64}/),
        modifiedDate: expect.any(Number),
        html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#nothing-to-see">Nothing To See</a></li></ol></nav><h1 id="nothing-to-see"><a aria-hidden="true" tabindex="-1" href="#nothing-to-see"><span class="icon icon-link"></span></a>Nothing To See</h1>\n<p>Markdown for testing <code>MarkdownPipeline.unit.ts</code>.</p>',
      },
    ]);
  });
});
