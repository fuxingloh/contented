import { beforeAll, describe, expect, it } from '@jest/globals';

import { JestMarkdownPipeline } from './JestMarkdownPipeline.js';

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
describe('JestMarkdownPipeline', () => {
  // @contented codeblock:start
  const pipeline = new JestMarkdownPipeline(__dirname, {
    type: 'Example',
    pattern: '**/*.unit.ts',
    processor: JestMarkdownPipeline,
  });
  // @contented codeblock:end

  beforeAll(async () => {
    // @contented codeblock:start
    await pipeline.init();
    // @contented codeblock:end
  });

  /* ## `@contented codeblock` */
  // This works

  it('should process JestMarkdownPipeline.unit.ts', async () => {
    // @contented codeblock:start
    const content = await pipeline.process(__dirname, 'JestMarkdownPipeline.unit.ts');
    expect(content).toStrictEqual([
      {
        type: 'Example',
        fields: {
          title: 'JestPipeline',
          description: 'This is an example of how to write Example Documentation with embedded codeblock!',
        },
        headings: [
          {
            children: [],
            depth: 2,
            headingId: 'comments',
            title: 'Comments',
          },
          {
            children: [],
            depth: 2,
            headingId: 'contented-codeblock',
            title: '@contented codeblock',
          },
        ],
        path: '/jest-markdown-pipeline-unit',
        sections: [],
        fileId: expect.stringMatching(/[0-f]{64}/),
        modifiedDate: expect.any(Number),
        html: expect.any(String),
      },
    ]);
    // @contented codeblock:end

    expect(content[0]?.html).toStrictEqual(
      '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#comments">Comments</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#contented-codeblock">@contented codeblock</a></li></ol></nav><p>This is an example of how to write Example Documentation with embedded codeblock!</p>\n' +
        '<h2 id="comments"><a aria-hidden="true" tabindex="-1" href="#comments"><span class="icon icon-link"></span></a>Comments</h2>\n' +
        '<p>All comments are automatically picked up.</p>\n' +
        '<div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"></span></code></pre></div>\n' +
        '<p>Natural flow of content and tests.</p>\n' +
        '<div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">pipeline</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">new</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">JestMarkdownPipeline</span><span style="color: var(--shiki-color-text)">(__dirname</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  type</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'Example\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  pattern</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'**/*.unit.ts\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  processor</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> JestMarkdownPipeline</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">});</span></span></code></pre></div>\n' +
        '<div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-keyword)">await</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">pipeline</span><span style="color: var(--shiki-token-function)">.init</span><span style="color: var(--shiki-color-text)">();</span></span></code></pre></div>\n' +
        '<h2 id="contented-codeblock"><a aria-hidden="true" tabindex="-1" href="#contented-codeblock"><span class="icon icon-link"></span></a><code>@contented codeblock</code></h2>\n' +
        '<p>This works</p>\n' +
        '<div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">content</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">await</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">pipeline</span><span style="color: var(--shiki-token-function)">.process</span><span style="color: var(--shiki-color-text)">(__dirname</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'JestMarkdownPipeline.unit.ts\'</span><span style="color: var(--shiki-color-text)">);</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-token-function)">expect</span><span style="color: var(--shiki-color-text)">(content)</span><span style="color: var(--shiki-token-function)">.toStrictEqual</span><span style="color: var(--shiki-color-text)">([</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    type</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'Example\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    fields</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">      title</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'JestPipeline\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">      description</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'This is an example of how to write Example Documentation with embedded codeblock!\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    }</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    headings</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> [</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">      {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        children</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> []</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        depth</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">2</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        headingId</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'comments\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        title</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'Comments\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">      }</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">      {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        children</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> []</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        depth</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">2</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        headingId</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'contented-codeblock\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">        title</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'@contented codeblock\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">      }</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    ]</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    path</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'/jest-markdown-pipeline-unit\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    sections</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> []</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    fileId</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">expect</span><span style="color: var(--shiki-token-function)">.stringMatching</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">/[0-f]</span><span style="color: var(--shiki-token-keyword)">{64}</span><span style="color: var(--shiki-token-string-expression)">/</span><span style="color: var(--shiki-color-text)">)</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    modifiedDate</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">expect</span><span style="color: var(--shiki-token-function)">.any</span><span style="color: var(--shiki-color-text)">(Number)</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    html</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">expect</span><span style="color: var(--shiki-token-function)">.any</span><span style="color: var(--shiki-color-text)">(String)</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  }</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">]);</span></span></code></pre></div>\n' +
        '<div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-function)">describe</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">\'@contented codeblock\'</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> () </span><span style="color: var(--shiki-token-keyword)">=></span><span style="color: var(--shiki-color-text)"> {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  </span><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">pipeline</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">new</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">JestMarkdownPipeline</span><span style="color: var(--shiki-color-text)">(__dirname</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    type</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'Example\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    pattern</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'**/*.unit.ts\'</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    processor</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> JestMarkdownPipeline</span><span style="color: var(--shiki-token-punctuation)">,</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  });</span></span>\n' +
        '<span class="line"></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  </span><span style="color: var(--shiki-token-function)">it</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">\'should pick up this codeblock\'</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">async</span><span style="color: var(--shiki-color-text)"> () </span><span style="color: var(--shiki-token-keyword)">=></span><span style="color: var(--shiki-color-text)"> {</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-keyword)">await</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">pipeline</span><span style="color: var(--shiki-token-function)">.init</span><span style="color: var(--shiki-color-text)">();</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">content</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">await</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">pipeline</span><span style="color: var(--shiki-token-function)">.process</span><span style="color: var(--shiki-color-text)">(__dirname</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">\'JestMarkdownPipeline.unit.ts\'</span><span style="color: var(--shiki-color-text)">);</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-function)">expect</span><span style="color: var(--shiki-color-text)">(content[</span><span style="color: var(--shiki-token-constant)">0</span><span style="color: var(--shiki-color-text)">]?.html)</span><span style="color: var(--shiki-token-function)">.toContain</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">\'should pick up this codeblock\'</span><span style="color: var(--shiki-color-text)">);</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">  });</span></span>\n' +
        '<span class="line"><span style="color: var(--shiki-color-text)">});</span></span></code></pre></div>',
    );
  });
});

// @contented codeblock:start
describe('@contented codeblock', () => {
  const pipeline = new JestMarkdownPipeline(__dirname, {
    type: 'Example',
    pattern: '**/*.unit.ts',
    processor: JestMarkdownPipeline,
  });

  it('should pick up this codeblock', async () => {
    await pipeline.init();
    const content = await pipeline.process(__dirname, 'JestMarkdownPipeline.unit.ts');
    expect(content[0]?.html).toContain('should pick up this codeblock');
  });
});
// @contented codeblock:end
