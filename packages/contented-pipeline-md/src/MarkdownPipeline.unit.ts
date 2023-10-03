import { join } from 'node:path';

import { MarkdownPipeline } from './MarkdownPipeline';
import { rehypeStringify, remarkParse, remarkRehype } from './UnifiedProcessor';

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

  it('should process RemarkDirective.md', async () => {
    const content = await pipeline.process(rootPath, 'RemarkDirective.md');
    expect(content).toStrictEqual([
      {
        type: 'Markdown',
        fields: {
          description: expect.any(String),
          title: 'RemarkDirective',
        },
        headings: expect.any(Array),
        path: '/remark-directive',
        sections: [],
        fileId: expect.stringMatching(/[0-f]{64}/),
        modifiedDate: expect.any(Number),
        html:
          '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#remarkdirective">RemarkDirective</a></li></ol></nav><h1 id="remarkdirective"><a aria-hidden="true" tabindex="-1" href="#remarkdirective"><span class="icon icon-link"></span></a>RemarkDirective</h1>\n' +
          '<div class="codeblock-group"><nav data-groups="[{&#x22;filename&#x22;:&#x22;example.ts&#x22;,&#x22;language&#x22;:&#x22;TypeScript&#x22;},{&#x22;filename&#x22;:&#x22;example.js&#x22;,&#x22;language&#x22;:&#x22;JavaScript&#x22;}]"><span class="codeblock-filename">example.ts</span><span class="codeblock-language"><button class="codeblock-language-selected">TypeScript</button><div class="codeblock-language-options"><div><button>TypeScript</button><button>JavaScript</button></div></div></span></nav><div class="codeblock-header" data-language="TypeScript" style=""><header><span class="codeblock-filename">example.ts</span><span class="codeblock-language">TypeScript</span></header><div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">a</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">number</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">1</span><span style="color: var(--shiki-color-text)">;</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">b</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">number</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">2</span><span style="color: var(--shiki-color-text)">;</span></span></code></pre></div></div><div class="codeblock-header" data-language="JavaScript" style="display: none;"><header><span class="codeblock-filename">example.js</span><span class="codeblock-language">JavaScript</span></header><div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">a</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">1</span><span style="color: var(--shiki-color-text)">;</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">b</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">2</span><span style="color: var(--shiki-color-text)">;</span></span></code></pre></div></div></div>\n' +
          '<div class="rehype-shiki"><pre class="shiki css-variable" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-color-text)">case \'div\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'table\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'tr\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'td\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'th\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'tbody\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'thead\':</span></span>\n' +
          '<span class="line"><span style="color: var(--shiki-color-text)">case \'tfoot\':</span></span></code></pre></div>\n' +
          '<p>Should only parse the tags above.</p>\n' +
          '<div><p>Should not parse onClick.</p></div>\n' +
          '<div><p>Should not parse script tags.</p></div>\n' +
          '<div class="admonitions green"><p>This is <code>div{.admonitions.green}</code>.</p></div>',
      },
    ]);
  });

  it('should process Features.md', async () => {
    const content = await pipeline.process(rootPath, 'Features.md');
    expect(content).toStrictEqual([
      {
        type: 'Markdown',
        fields: {
          description: 'Description Override',
          title: 'Title Override',
        },
        headings: expect.any(Array),
        path: '/features',
        sections: [],
        fileId: expect.stringMatching(/[0-f]{64}/),
        modifiedDate: expect.any(Number),
        html: '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#features">Features</a></li></ol></nav><h1 id="features"><a aria-hidden="true" tabindex="-1" href="#features"><span class="icon icon-link"></span></a>Features</h1>\n<div class="mermaid">graph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n  C-->D;\n</div>',
      },
    ]);
  });
});

describe('Custom Pipeline', () => {
  const pipeline = new (MarkdownPipeline.withProcessor((processor) => {
    processor.use(remarkParse).use(remarkRehype).use(rehypeStringify);
  }))(__dirname, {
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
        fields: {},
        headings: [],
        path: '/see-nothing',
        sections: [],
        fileId: expect.stringMatching(/[0-f]{64}/),
        modifiedDate: expect.any(Number),
        html: '<h1>Nothing To See</h1>\n<p>Markdown for testing <code>MarkdownPipeline.unit.ts</code>.</p>',
      },
    ]);
  });
});
