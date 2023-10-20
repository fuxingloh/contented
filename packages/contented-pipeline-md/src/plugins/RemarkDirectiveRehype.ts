import { h } from 'hastscript';
import type { Node } from 'mdast';
import type { Directives } from 'mdast-util-directive';
import type { Plugin } from 'unified';
import type { MapFunction } from 'unist-util-map';
import { map } from 'unist-util-map';

const isDirectiveNode = (node: Node): node is Directives => {
  const { type } = node;
  return type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective';
};

function isTagAllowed(tagName: string): boolean {
  switch (tagName) {
    case 'div':
    case 'table':
    case 'tr':
    case 'td':
    case 'th':
    case 'tbody':
    case 'thead':
    case 'tfoot':
      return true;
    default:
      return false;
  }
}

const mapDirectiveNode: MapFunction<Node> = (node: Node) => {
  if (isDirectiveNode(node)) {
    const { tagName, properties } = h(node.name, node.attributes ?? {});

    if (!isTagAllowed(tagName)) {
      return node;
    }

    return {
      ...node,
      data: {
        hName: tagName,
        hProperties: {
          className: properties?.className,
        },
      },
    };
  }

  return node;
};

export function remarkDirectiveRehype(): Plugin {
  return (nodeTree) => map(nodeTree, mapDirectiveNode);
}
