import rehypeToc from '@jsdevtools/rehype-toc';
import rehypeShiki from '@leafac/rehype-shiki';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { getHighlighter, HighlighterOptions } from 'shiki';
import type * as unified from 'unified';

import { rehypeMermaid } from './rehype/Mermaid';

export interface UnifiedOptions {
  shiki?: HighlighterOptions;
}

export async function createMarkdownProcessor(options?: UnifiedOptions): Promise<(builder: unified.Processor) => void> {
  const highlighter = await getHighlighter({
    theme: 'github-dark-dimmed',
    ...options?.shiki,
  });

  return (builder) => {
    builder
      .use(remarkGfm)
      .use(remarkFrontmatter)
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkDirectiveRehype)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypeToc)
      .use(rehypeMermaid)
      .use(rehypeShiki, { highlighter })
      .use(rehypeStringify);
  };
}
