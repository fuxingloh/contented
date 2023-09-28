import { h } from 'hastscript';
import type { Directive as DirectiveNode } from 'mdast-util-directive';
import type { Plugin } from 'unified';
import type { Node } from 'unist';
import type { MapFunction } from 'unist-util-map';
import { map } from 'unist-util-map';

const isDirectiveNode = (node: Node): node is DirectiveNode => {
  const { type } = node;
  return type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective';
};

function parseHastProperties(node: DirectiveNode): { tagName: string; properties: Record<string, string> } {
  // @ts-ignore
  return h(node.name, node.attributes);
}

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

const mapDirectiveNode: MapFunction = (node) => {
  if (isDirectiveNode(node)) {
    const { tagName, properties } = parseHastProperties(node);

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
