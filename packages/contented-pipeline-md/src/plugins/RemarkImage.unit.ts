import { join } from 'node:path';

import { MarkdownPipeline } from '../MarkdownPipeline';

const rootPath = join(__dirname, '../../fixtures');
const outPath = join(rootPath, 'dist');

const pipeline = new MarkdownPipeline(
  rootPath,
  {
    type: 'Markdown',
    pattern: '*/*.md',
    processor: 'md',
  },
  outPath,
);

beforeAll(async () => {
  await pipeline.init();
});

it('should process RemarkImage.md', async () => {
  const content = await pipeline.process(rootPath, 'RemarkImage.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: {
        title: 'Remark Images',
        description: 'Copy local images to the output directory.',
      },
      headings: expect.any(Array),
      sections: [],
      path: '/remark-image',
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html:
        '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#remark-images">Remark Images</a></li></ol></nav><h1 id="remark-images"><a aria-hidden="true" tabindex="-1" href="#remark-images"><span class="icon icon-link"></span></a>Remark Images</h1>\n' +
        '<p>Copy local images to the output directory.</p>\n' +
        '<p><img src="./images/9f9ae2af77218eda79f3164cab7bc31cf66d12c9342e0b20276e901a88cb26a3.png" alt="Local Image"></p>',
    },
  ]);
});

it('should process RemarkImage-invalid.md', async () => {
  const content = await pipeline.process(rootPath, 'RemarkImage-invalid.md');
  expect(content).toStrictEqual([
    {
      type: 'Markdown',
      fields: expect.any(Object),
      headings: expect.any(Array),
      sections: [],
      path: '/remark-image-invalid',
      fileId: expect.stringMatching(/[0-f]{64}/),
      modifiedDate: expect.any(Number),
      html:
        '<nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#invalid-images">Invalid Images</a></li></ol></nav><h1 id="invalid-images"><a aria-hidden="true" tabindex="-1" href="#invalid-images"><span class="icon icon-link"></span></a>Invalid Images</h1>\n' +
        '<p><img src="https://github.com/levaintech.png" alt="Remote Image">\n' +
        '<img src="./something.png" alt="Invalid Image — do not exist">\n' +
        '![Invalid Image — not a valid scheme](some file)</p>',
    },
  ]);
});
