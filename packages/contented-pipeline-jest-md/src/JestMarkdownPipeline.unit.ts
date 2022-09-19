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
        fields: {},
        headings: [
          {
            children: [],
            depth: 2,
            id: 'comments',
            title: 'Comments',
          },
          {
            children: [],
            depth: 2,
            id: 'contented-codeblock',
            title: '@contented codeblock',
          },
        ],
        path: '/jest-markdown-pipeline',
        sections: [],
        id: expect.stringMatching(/[0-f]{64}/),
        modifiedDate: expect.any(Number),
        html: expect.any(String),
      },
    ]);
    // @contented codeblock:end

    expect(content[0]?.html).toStrictEqual(
      '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#comments">Comments</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#contented-codeblock">@contented codeblock</a></li></ol></nav><p>This is an example of how to write Example Documentation with embedded codeblock!</p>\n' +
        '<h2 id="comments"><a aria-hidden="true" tabindex="-1" href="#comments"><span class="icon icon-link"></span></a>Comments</h2>\n' +
        '<p>All comments are automatically picked up.</p>\n' +
        '<pre class="shiki" style="background-color: #22272e"><code><span class="line"></span></code></pre>\n' +
        '<p>Natural flow of content and tests.</p>\n' +
        '<pre class="shiki" style="background-color: #22272e"><code><span class="line"><span style="color: #F47067">const</span><span style="color: #ADBAC7"> </span><span style="color: #6CB6FF">pipeline</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">=</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">new</span><span style="color: #ADBAC7"> </span><span style="color: #DCBDFB">JestMarkdownPipeline</span><span style="color: #ADBAC7">(__dirname, {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  type: </span><span style="color: #96D0FF">\'Example\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  pattern: </span><span style="color: #96D0FF">\'**/*.unit.ts\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  processor: JestMarkdownPipeline,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">});</span></span></code></pre>\n' +
        '<pre class="shiki" style="background-color: #22272e"><code><span class="line"><span style="color: #F47067">await</span><span style="color: #ADBAC7"> pipeline.</span><span style="color: #DCBDFB">init</span><span style="color: #ADBAC7">();</span></span></code></pre>\n' +
        '<h2 id="contented-codeblock"><a aria-hidden="true" tabindex="-1" href="#contented-codeblock"><span class="icon icon-link"></span></a><code>@contented codeblock</code></h2>\n' +
        '<p>This works</p>\n' +
        '<pre class="shiki" style="background-color: #22272e"><code><span class="line"><span style="color: #F47067">const</span><span style="color: #ADBAC7"> </span><span style="color: #6CB6FF">content</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">=</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">await</span><span style="color: #ADBAC7"> pipeline.</span><span style="color: #DCBDFB">process</span><span style="color: #ADBAC7">(__dirname, </span><span style="color: #96D0FF">\'JestMarkdownPipeline.unit.ts\'</span><span style="color: #ADBAC7">);</span></span>\n' +
        '<span class="line"><span style="color: #DCBDFB">expect</span><span style="color: #ADBAC7">(content).</span><span style="color: #DCBDFB">toStrictEqual</span><span style="color: #ADBAC7">([</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    type: </span><span style="color: #96D0FF">\'Example\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    fields: {},</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    headings: [</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">      {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        children: [],</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        depth: </span><span style="color: #6CB6FF">2</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        id: </span><span style="color: #96D0FF">\'comments\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        title: </span><span style="color: #96D0FF">\'Comments\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">      },</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">      {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        children: [],</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        depth: </span><span style="color: #6CB6FF">2</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        id: </span><span style="color: #96D0FF">\'contented-codeblock\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">        title: </span><span style="color: #96D0FF">\'@contented codeblock\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">      },</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    ],</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    path: </span><span style="color: #96D0FF">\'/jest-markdown-pipeline\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    sections: [],</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    id: expect.</span><span style="color: #DCBDFB">stringMatching</span><span style="color: #ADBAC7">(</span><span style="color: #96D0FF">/</span><span style="color: #6CB6FF">[0-f]</span><span style="color: #F47067">{64}</span><span style="color: #96D0FF">/</span><span style="color: #ADBAC7">),</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    modifiedDate: expect.</span><span style="color: #DCBDFB">any</span><span style="color: #ADBAC7">(Number),</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    html: expect.</span><span style="color: #DCBDFB">any</span><span style="color: #ADBAC7">(String),</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  },</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">]);</span></span></code></pre>\n' +
        '<pre class="shiki" style="background-color: #22272e"><code><span class="line"><span style="color: #DCBDFB">describe</span><span style="color: #ADBAC7">(</span><span style="color: #96D0FF">\'@contented codeblock\'</span><span style="color: #ADBAC7">, () </span><span style="color: #F47067">=></span><span style="color: #ADBAC7"> {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  </span><span style="color: #F47067">const</span><span style="color: #ADBAC7"> </span><span style="color: #6CB6FF">pipeline</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">=</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">new</span><span style="color: #ADBAC7"> </span><span style="color: #DCBDFB">JestMarkdownPipeline</span><span style="color: #ADBAC7">(__dirname, {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    type: </span><span style="color: #96D0FF">\'Example\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    pattern: </span><span style="color: #96D0FF">\'**/*.unit.ts\'</span><span style="color: #ADBAC7">,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    processor: JestMarkdownPipeline,</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  });</span></span>\n' +
        '<span class="line"></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  </span><span style="color: #DCBDFB">it</span><span style="color: #ADBAC7">(</span><span style="color: #96D0FF">\'should pick up this codeblock\'</span><span style="color: #ADBAC7">, </span><span style="color: #F47067">async</span><span style="color: #ADBAC7"> () </span><span style="color: #F47067">=></span><span style="color: #ADBAC7"> {</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    </span><span style="color: #F47067">await</span><span style="color: #ADBAC7"> pipeline.</span><span style="color: #DCBDFB">init</span><span style="color: #ADBAC7">();</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    </span><span style="color: #F47067">const</span><span style="color: #ADBAC7"> </span><span style="color: #6CB6FF">content</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">=</span><span style="color: #ADBAC7"> </span><span style="color: #F47067">await</span><span style="color: #ADBAC7"> pipeline.</span><span style="color: #DCBDFB">process</span><span style="color: #ADBAC7">(__dirname, </span><span style="color: #96D0FF">\'JestMarkdownPipeline.unit.ts\'</span><span style="color: #ADBAC7">);</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">    </span><span style="color: #DCBDFB">expect</span><span style="color: #ADBAC7">(content[</span><span style="color: #6CB6FF">0</span><span style="color: #ADBAC7">]?.html).</span><span style="color: #DCBDFB">toContain</span><span style="color: #ADBAC7">(</span><span style="color: #96D0FF">\'should pick up this codeblock\'</span><span style="color: #ADBAC7">);</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">  });</span></span>\n' +
        '<span class="line"><span style="color: #ADBAC7">});</span></span></code></pre>',
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
