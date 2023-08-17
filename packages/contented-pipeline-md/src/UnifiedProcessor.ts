import rehypeToc from '@jsdevtools/rehype-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { getHighlighter, HighlighterOptions } from 'shiki';
import { Plugin, Processor } from 'unified';

import { rehypeHeading } from './plugins/RehypeHeading.js';
import { rehypeMermaid } from './plugins/RehypeMermaid.js';
import { rehypeShiki } from './plugins/RehypeShiki.js';
import {
  remarkDirectiveRehypeCodeblockGroup,
  remarkDirectiveRehypeCodeblockHeader,
} from './plugins/RemarkCodeblock.js';
import { collectFields, resolveFields, validateFields } from './plugins/RemarkFrontmatter.js';
import { remarkLink } from './plugins/RemarkLink.js';

export interface UnifiedOptions {
  shiki?: HighlighterOptions;
  before?: Plugin[];
  remarks?: Plugin[];
  rehypes?: Plugin[];
  after?: Plugin[];
}

export async function initProcessor(processor: Processor, options?: UnifiedOptions) {
  options?.before?.forEach((plugin) => {
    processor.use(plugin);
  });

  processor
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(remarkParse)
    .use(remarkLink)
    .use(remarkDirective)
    .use(remarkDirectiveRehypeCodeblockHeader)
    .use(remarkDirectiveRehypeCodeblockGroup)
    .use(remarkDirectiveRehype);

  processor.use(collectFields).use(resolveFields).use(validateFields);

  options?.remarks?.forEach((plugin) => {
    processor.use(plugin);
  });

  processor.use(remarkRehype);

  options?.rehypes?.forEach((plugin) => {
    processor.use(plugin);
  });

  processor
    .use(rehypeExternalLinks, { target: '_blank' })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeToc)
    .use(rehypeHeading)
    .use(rehypeMermaid)
    .use(rehypeShiki, {
      highlighter: {
        light: await getHighlighter({ theme: 'github-light' }),
        dark: await getHighlighter({ theme: 'github-dark' }),
      },
    });

  processor.use(rehypeStringify);

  options?.after?.forEach((plugin) => {
    processor.use(plugin);
  });
}
