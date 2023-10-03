import rehypeToc from '@jsdevtools/rehype-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { Plugin, Processor } from 'unified';

import { rehypeHeading } from './plugins/RehypeHeading.js';
import { rehypeMermaid } from './plugins/RehypeMermaid.js';
import { rehypeShiki } from './plugins/RehypeShiki.js';
import {
  remarkDirectiveRehypeCodeblockGroup,
  remarkDirectiveRehypeCodeblockHeader,
} from './plugins/RemarkCodeblock.js';
import { remarkDirectiveRehype } from './plugins/RemarkDirectiveRehype.js';
import {
  remarkFrontmatterCollect,
  remarkFrontmatterResolve,
  remarkFrontmatterValidate,
} from './plugins/RemarkFrontmatter.js';
import { remarkLink } from './plugins/RemarkLink.js';

export interface UnifiedOptions {
  before?: Plugin[];
  remarks?: Plugin[];
  rehypes?: Plugin[];
  after?: Plugin[];
}

export function initProcessor(processor: Processor, options?: UnifiedOptions): Processor {
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

  processor.use(remarkFrontmatterCollect).use(remarkFrontmatterResolve).use(remarkFrontmatterValidate);

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
    .use(rehypeShiki);

  processor.use(rehypeStringify);

  options?.after?.forEach((plugin) => {
    processor.use(plugin);
  });

  return processor;
}

export {
  rehypeAutolinkHeadings,
  rehypeExternalLinks,
  rehypeHeading,
  rehypeMermaid,
  rehypeShiki,
  rehypeSlug,
  rehypeStringify,
  rehypeToc,
  remarkDirective,
  remarkDirectiveRehype,
  remarkDirectiveRehypeCodeblockGroup,
  remarkDirectiveRehypeCodeblockHeader,
  remarkFrontmatter,
  remarkFrontmatterCollect,
  remarkFrontmatterResolve,
  remarkFrontmatterValidate,
  remarkGfm,
  remarkLink,
  remarkParse,
  remarkRehype,
};
