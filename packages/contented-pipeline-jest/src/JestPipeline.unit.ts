import { JestPipeline } from './JestPipeline.js';

/**
 * ---
 * title: JestPipeline
 * ---
 *
 * This is an example of how to write Example Documentation with embedded codeblock!
 *
 * ## Comments
 *
 * All comments are automatically picked up.
 * ```ts
 * ```
 *
 * Natural flow of content and tests.
 */
describe('Without Config', () => {
  // @contented codeblock:start
  const pipeline = new JestPipeline({
    type: 'Example',
    pattern: '**/*.unit.ts',
    processor: JestPipeline,
  });
  // @contented codeblock:end

  // @contented codeblock
  beforeAll(async () => {
    await pipeline.init();
  });

  /*## `@contented codeblock`*/
  // This works

  // @contented codeblock
  it('should process JestPipeline.unit.ts', async () => {
    const content = await pipeline.process(__dirname, 'JestPipeline.unit.ts');
    expect(content).toStrictEqual({
      type: 'Example',
      fields: {},
      headings: [
        {
          depth: 1,
          id: 'nothing-to-see',
          title: 'Nothing To See',
          children: [],
        },
      ],
      path: '/jest-pipeline',
      sections: [],
      id: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#nothing-to-see">Nothing To See</a></li></ol></nav><h1 id="nothing-to-see"><a aria-hidden="true" tabindex="-1" href="#nothing-to-see"><span class="icon icon-link"></span></a>Nothing To See</h1>\n<p>Markdown for testing <code>MarkdownPipeline.unit.ts</code>.</p>',
    });
  });
});

// @contented codeblock
describe('@contented codeblock', () => {
  const pipeline = new JestPipeline({
    type: 'Example',
    pattern: '**/*.unit.ts',
    processor: JestPipeline,
  });

  it('should pick up this codeblock', async function () {
    await pipeline.init();
    const content = await pipeline.process(__dirname, 'JestPipeline.unit.ts');
    expect(content?.html).toStrictEqual('');
  });
});
