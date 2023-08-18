import { Parent } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

function visitCodeblockHeader(node: ContainerDirective): void {
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
      dataLanguage: node.attributes?.language ?? '',
    },
  };
}

export function remarkDirectiveRehypeCodeblockHeader(): Transformer<Parent> {
  return (nodeTree: any) => visit(nodeTree, 'containerDirective', visitCodeblockHeader);
}

function visitCodeblockGroup(node: ContainerDirective): void {
  if (node.name !== 'codeblock-group') return;

  const types: Record<string, string>[] = node.children
    .filter((child: any) => child.name === 'codeblock-header')
    .map((child: any) => child.attributes);

  if (types.length === 0) return;

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
              value: types[0].filename ?? '',
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
          // @ts-ignore
          type: 'element',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: types[0].language ?? '',
                },
              ],
              data: {
                hName: 'button',
                hProperties: {
                  className: 'codeblock-language-selected',
                },
              },
            },
            {
              type: 'paragraph',
              children: [
                {
                  // @ts-ignore
                  type: 'element',
                  // @ts-ignore
                  children: types.map((type) => ({
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        value: type.language ?? '',
                      },
                    ],
                    data: {
                      hName: 'button',
                    },
                  })),
                },
              ],
              data: {
                hName: 'div',
                hProperties: {
                  className: 'codeblock-language-options',
                },
              },
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
        hName: 'nav',
        hProperties: {
          dataGroups: JSON.stringify(types),
        },
      },
    },
    ...node.children.map((child: any, index: number) => {
      if (child.name === 'codeblock-header') {
        child.data = {
          ...child.data,
          hProperties: {
            ...child.data.hProperties,
            style: index === 0 ? '' : 'display: none;',
          },
        };
      }
      return child;
    }),
  ];
  node.data = {
    hName: 'div',
    hProperties: {
      className: 'codeblock-group',
    },
  };
}

export function remarkDirectiveRehypeCodeblockGroup(): Transformer<Parent> {
  return (nodeTree: any) => visit(nodeTree, 'containerDirective', visitCodeblockGroup);
}
