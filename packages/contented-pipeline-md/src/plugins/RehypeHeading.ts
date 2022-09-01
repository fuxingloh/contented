import { FileContentHeadings } from '@birthdayresearch/contented-pipeline';
import { Content, Parent } from 'hast';
import { toString } from 'hast-util-to-string';
import { Transformer } from 'unified';

import { UnifiedContented } from './Plugin.js';

export function rehypeHeading(): Transformer<Parent> {
  return (tree, file) => {
    const headings = collectHeadings(tree, []);

    const contented = file.data.contented as UnifiedContented;
    contented.headings = mergeHeadings(headings);
  };
}

function collectHeadings(node: Parent, headings: FileContentHeadings[] = []): FileContentHeadings[] {
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

function mergeHeadings(headings: FileContentHeadings[]): FileContentHeadings[] {
  const root: FileContentHeadings[] = [];
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
    // eslint-disable-next-line  no-param-reassign
    contentHeading.children = mergeHeadings(contentHeading.children);
  });

  return root;
}
