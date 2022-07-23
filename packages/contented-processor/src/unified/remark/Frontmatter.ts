import { Parent } from 'mdast';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import yaml from 'js-yaml';

/**
 * Transform mermaid codeblock into div.mermaid
 */
export function frontmatterFields(): Transformer<Parent> {
  return function transformer(tree: Parent, file) {
    const node = tree.children?.[0];
    if (node?.type === 'yaml') {
      file.data.contented = {
        ...((file.data.contented as any) || {}),
        fields: yaml.load(node.value),
      };
    }
  };
}
