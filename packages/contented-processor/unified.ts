import rehypeToc from '@jsdevtools/rehype-toc';
import rehypeShiki from '@leafac/rehype-shiki';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { getHighlighter, HighlighterOptions } from 'shiki';
import type * as unified from 'unified';

export interface UnifiedOptions {
  shiki?: HighlighterOptions;
}

export async function getUnifiedProcessor(options?: UnifiedOptions): Promise<(builder: unified.Processor) => void> {
  const highlighter = await getHighlighter({
    theme: 'github-dark-dimmed',
    ...options?.shiki,
  });

  return (builder) => {
    builder
      .use(remarkGfm)
      .use(remarkFrontmatter)
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypeToc)
      .use(rehypeShiki, { highlighter })
      .use(rehypeStringify);
  };
}
