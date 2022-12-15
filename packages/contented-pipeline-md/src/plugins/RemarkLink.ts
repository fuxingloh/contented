import { parse } from 'node:url';

import { Link, Parent } from 'mdast';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { UnifiedContented } from './Plugin.js';

export function remarkLink(): Transformer<Parent> {
  return (tree, file) => {
    visit(tree, 'link', visitLink(file));
  };
}

function visitLink(file: VFile): (node: Link) => void {
  const contented = file.data?.contented as UnifiedContented;

  return (node) => {
    if (parse(node.url).hostname !== null) {
      return;
    }
    // eslint-disable-next-line  no-param-reassign
    node.url = contented.contentedPipeline.getSanitizedPath(node.url);
  };
}
