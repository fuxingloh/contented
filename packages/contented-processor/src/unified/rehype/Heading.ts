import { Content, Parent } from 'hast';
import { toString } from 'hast-util-to-string';
import { Transformer } from 'unified';

import { UnifiedContented } from '../../ContentedUnified.js';

export interface ContentHeading {
  id: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  children: ContentHeading[];
}

export function rehypeHeading(): Transformer<Parent> {
  return function transformer(tree, file) {
    const contented = file.data.contented as UnifiedContented;
    contented.headings = computeHeadings(tree);
  };
}

function computeHeadings(tree: Parent) {
  const headings = collectHeadings(tree, []);
  return mergeHeadings(headings);
}

function collectHeadings(node: Parent, headings: ContentHeading[] = []): ContentHeading[] {
  node?.children?.forEach((child: Content) => {
    if (child.type === 'element') {
      // eslint-disable-next-line default-case
      switch (child.tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
          headings.push({
            depth: Number.parseInt(child.tagName.substring(1), 10) as any,
            id: (child.properties?.id as string) ?? '',
            title: toString(child),
            children: [],
          });
      }

      collectHeadings(child as Parent, headings);
    }
  });

  return headings;
}

function mergeHeadings(headings: ContentHeading[]): ContentHeading[] {
  const root: ContentHeading[] = [];
  headings.forEach((heading) => {
    const previous = root[root.length - 1];
    if (!previous) {
      root.push(heading);
      return;
    }

    if (previous.depth < heading.depth) {
      previous.children.push(heading);
    } else {
      root.push(heading);
    }
  });

  root.forEach((contentHeading) => {
    contentHeading.children = mergeHeadings(contentHeading.children);
  });

  return root;
}
