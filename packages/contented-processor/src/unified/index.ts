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
import { Processor, unified, VFileWithOutput } from 'unified';
import { rehypeMermaid } from './rehype/Mermaid';
import fs from 'node:fs/promises';

export type UnifiedProcessor = 'md'

export type UnifiedProcessorRunner = (filePath: string) => Promise<VFileWithOutput<any>>

export async function createUnifiedProcessorRunner(processor: UnifiedProcessor): Promise<UnifiedProcessorRunner | undefined> {
  if (processor === 'md') {
    const builder = await markdownBuilder();
    const processor = unified();
    builder(processor);

    return async (filePath: string): Promise<VFileWithOutput<any>> => {
      const file = await fs.readFile(filePath)
      return processor.process(file);
    };
  }
}

export interface UnifiedOptions {
  shiki?: HighlighterOptions;
}

async function markdownBuilder(options?: UnifiedOptions): Promise<(builder: Processor) => void> {
  const highlighter = await getHighlighter({
    theme: 'github-dark-dimmed',
    ...options?.shiki,
  });

  return (processor) => {
    processor
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
