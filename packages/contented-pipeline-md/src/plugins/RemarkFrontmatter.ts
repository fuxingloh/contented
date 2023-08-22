import yaml from 'js-yaml';
import { truncate } from 'lodash';
import { Heading, Paragraph, Parent } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { UnifiedContented } from './Plugin.js';

export function collectFields(): Transformer<Parent> {
  return (tree: Parent, file) => {
    const node = tree.children?.[0];
    if (node?.type === 'yaml') {
      const contented = file.data.contented as UnifiedContented;
      contented.fields = yaml.load(node.value) as any;
    }

    visit(tree, 'heading', visitTitle(file));
    visit(tree, 'paragraph', visitDescription(file));
  };
}

function visitTitle(file: VFile): (node: Heading) => void {
  const contented = file.data?.contented as UnifiedContented;

  return (node: Heading) => {
    if (contented.fields.title) {
      return;
    }

    contented.fields.title = toString(node);
  };
}

function visitDescription(file: VFile): (node: Paragraph) => void {
  const contented = file.data?.contented as UnifiedContented;

  return (node: Paragraph) => {
    if (contented.fields.description) {
      return;
    }

    const description = toString(node).replaceAll('\n', ' ');
    contented.fields.description = truncate(description, {
      length: 250,
    });
  };
}

export function resolveFields(): Transformer<Parent> {
  return async (tree: Parent, file) => {
    const contented = file.data.contented as UnifiedContented;
    const entries = Object.entries(contented.pipeline.fields ?? {});
    const context = {
      tree,
      file,
    };

    const fields: Record<string, any> = {};
    for (const [key, field] of entries) {
      if (field.resolve) {
        fields[key] = await field.resolve(contented.fields[key], context);
      } else {
        fields[key] = contented.fields[key];
      }
    }
    contented.fields = fields;
  };
}

export function validateFields(): Transformer<Parent> {
  return async (tree: Parent, file) => {
    const contented = file.data.contented as UnifiedContented;
    const entries = Object.entries(contented.pipeline.fields ?? {});

    for (const [key, field] of entries) {
      if (!isTypeValid(field.type, contented.fields[key])) {
        contented.fields[key] = undefined;

        if (field.required) {
          contented.errors.push({
            type: 'fields',
            reason: `required.${key}`,
          });
        }
      }
    }
  };
}

function isTypeValid(type: string, value: any) {
  switch (type.replaceAll(' ', '')) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'string[]':
      return Array.isArray(value) && value.every((s) => typeof s === 'string');
    case 'number[]':
      return Array.isArray(value) && value.every((s) => typeof s === 'number');
    default:
      return false;
  }
}
