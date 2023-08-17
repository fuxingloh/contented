import { Parent } from 'mdast';
import type { Directive as DirectiveNode } from 'mdast-util-directive';
import { ContainerDirective } from 'mdast-util-directive';
import { Transformer } from 'unified';
import { Node } from 'unist';
import { map, MapFunction } from 'unist-util-map';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

function isDirectiveNode(node: Node): node is DirectiveNode {
  return node.type === 'textDirective' || node.type === 'leafDirective' || node.type === 'containerDirective';
}

function mapCodeblockHeader(node: ContainerDirective): void {
  if (node.name !== 'codeblock-header') return;

  // @ts-ignore
  node.type = 'element';
  node.children = [
    {
      // @ts-ignore
      type: 'element',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: node.attributes?.filename ?? '',
            },
          ],
          data: {
            hName: 'span',
            hProperties: {
              className: 'codeblock-filename',
            },
          },
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: node.attributes?.language ?? '',
            },
          ],
          data: {
            hName: 'span',
            hProperties: {
              className: 'codeblock-language',
            },
          },
        },
      ],
      data: {
        hName: 'header',
        hProperties: {},
      },
    },
    ...node.children,
  ];
  node.data = {
    hName: 'div',
    hProperties: {
      className: 'codeblock-header',
    },
  };
}

export function remarkDirectiveRehypeCodeblockHeader(): Transformer<Parent> {
  return (nodeTree: any) => visit(nodeTree, 'containerDirective', mapCodeblockHeader);
}

function mapCodeblockGroup(file: VFile): MapFunction {
  return (node: Node) => {
    if (!isDirectiveNode(node)) {
      return node;
    }

    if (node.name !== 'codeblock-group') return node;
    if (node.type === 'textDirective') file.fail('Text directives for `codeblock-group` not supported', node);
    return {
      type: 'element',
      children: [...node.children],
      data: {
        hName: 'div',
        hProperties: {
          className: 'codeblock-group',
        },
      },
    };
  };
}

export function remarkDirectiveRehypeCodeblockGroup(): Transformer<Parent> {
  return (nodeTree: any, file: VFile) => map(nodeTree, mapCodeblockGroup(file));
}