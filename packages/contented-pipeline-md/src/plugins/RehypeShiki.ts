import { Element } from 'hast';
import { toString } from 'hast-util-to-string';
import rehypeParse from 'rehype-parse';
import * as Shiki from 'shiki';
import { getHighlighter, renderToHtml } from 'shiki';
import { Transformer, unified } from 'unified';
import { visit } from 'unist-util-visit';

export function rehypeShiki(): Transformer {
  return async (tree) => {
    const highlighter = await getHighlighter({
      theme: 'css-variables',
    });

    function visitCodeblock(node: Element) {
      if (node.tagName !== 'pre') {
        return;
      }

      const child = (node.children as Element[])[0];
      if (child?.tagName !== 'code') {
        return;
      }

      const className = child?.properties?.className as string[] | undefined;
      if (!className?.[0].startsWith('language-')) {
        return;
      }
      const language = className[0].slice('language-'.length);
      const code = toString(child).slice(0, -1);

      node.properties = {
        ...node.properties,
        className: ['rehype-shiki'],
      };
      node.tagName = 'div';
      node.children = pre({ highlighter, code, language });
    }

    visit(tree, 'element', visitCodeblock);
  };
}

const hastParser = unified().use(rehypeParse, { fragment: true });

function pre(options: { highlighter: Shiki.Highlighter; code: string; language: string }): Element[] {
  const tokens = options.highlighter.codeToThemedTokens(options.code, options.language);
  const html = renderToHtml(tokens, {
    fg: options.highlighter.getForegroundColor(),
    bg: options.highlighter.getBackgroundColor(),
    elements: {
      pre({ className, style, children }) {
        return `<pre class='${className} css-variable' style='${style}'>${children}</pre>`;
      },
    },
  });
  const parsedOutput = hastParser.parse(html);
  return parsedOutput.children.filter((child) => child.type === 'element') as Element[];
}
