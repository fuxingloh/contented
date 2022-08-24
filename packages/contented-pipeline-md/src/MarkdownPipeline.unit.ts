import { MarkdownPipeline } from './MarkdownPipeline';
import { join } from 'node:path';

const rootPath = join(__dirname, '../fixtures');

describe('Without Config', function () {
  const pipeline = new MarkdownPipeline({
    type: 'Markdown',
    pattern: '**/*.md',
    processor: 'md',
  });

  beforeAll(async function () {
    await pipeline.init();
  });

  it('should process See.Nothing.md', async function () {
    const content = await pipeline.process(rootPath, 'See.Nothing.md');
    console.log(content);
    expect(content).toStrictEqual({
      type: 'Markdown',
      fields: {},
      headings: [
        {
          depth: 1,
          id: 'nothing-to-see',
          title: 'Nothing To See',
          children: [],
        },
      ],
      path: '/see-nothing',
      sections: [],
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#nothing-to-see">Nothing To See</a></li></ol></nav><h1 id="nothing-to-see"><a aria-hidden="true" tabindex="-1" href="#nothing-to-see"><span class="icon icon-link"></span></a>Nothing To See</h1>\n<p>Markdown for testing <code>MarkdownPipeline.unit.ts</code>.</p>',
    });
  });
});
