import { Element } from 'hast';
import { toString } from 'hast-util-to-string';
import rehypeParse from 'rehype-parse';
import * as Shiki from 'shiki';
import shiki from 'shiki';
import { Transformer, unified } from 'unified';
import { visit } from 'unist-util-visit';

export function rehypeShiki(options: {
  highlighter: {
    light: Shiki.Highlighter;
    dark: Shiki.Highlighter;
  };
}): Transformer {
  function visitCodeBlock(node: Element) {
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

    /* eslint-disable  no-param-reassign */
    node.properties = {
      ...node.properties,
      className: ['rehype-shiki'],
    };
    node.tagName = 'div';
    node.children = [
      ...pre({
        highlighter: options.highlighter.light,
        className: ['theme-light'],
        code,
        language,
      }),
      ...pre({
        highlighter: options.highlighter.dark,
        className: ['theme-dark'],
        code,
        language,
      }),
    ];
    /* eslint-enable  no-param-reassign */
  }

  return (tree) => {
    visit(tree, 'element', visitCodeBlock);
  };
}

const hastParser = unified().use(rehypeParse, { fragment: true });

function pre(options: {
  highlighter: Shiki.Highlighter;
  code: string;
  language: string;
  className: string[];
}): Element[] {
  const tokens = options.highlighter.codeToThemedTokens(options.code, options.language);
  const html = shiki.renderToHtml(tokens, {
    fg: options.highlighter.getForegroundColor(),
    bg: options.highlighter.getBackgroundColor(),
    elements: {
      pre({ className, style, children }) {
        return `<pre class='${className} ${options.className.join(
          ' ',
        )}' style='${style}' tabindex='0'>${children}</pre>`;
      },
    },
  });
  const parsedOutput = hastParser.parse(html);
  return parsedOutput.children.filter((child) => child.type === 'element') as Element[];
}
