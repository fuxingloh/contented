import { Parent } from 'mdast';
import { Transformer } from 'unified';
import yaml from 'js-yaml';
import { UnifiedContented } from '../index';
import { VFile } from 'vfile';

export type PipelineField =
  | AbstractField<'string', string>
  | AbstractField<'number', number>
  | AbstractField<'string[]', string[]>
  | AbstractField<'number[]', number[]>;

export interface AbstractField<NamedType, T> {
  type: NamedType;
  required?: boolean;
  resolve?: (d: T | undefined, parent: Parent, file: VFile) => T | Promise<T>;
}

export function collectFields(): Transformer<Parent> {
  return function transformer(tree: Parent, file) {
    const node = tree.children?.[0];
    if (node?.type === 'yaml') {
      const contented = file.data.contented as UnifiedContented;
      contented.fields = yaml.load(node.value) as any;
    }
  };
}

export function validateFields(): Transformer<Parent> {
  return async function transformer(tree: Parent, file: VFile) {
    const contented = file.data.contented as UnifiedContented;
    // If pipeline.fields isn't default, remove all fields
    if (contented.pipeline.fields === undefined) {
      contented.fields = {};
      return;
    }

    const fields: Record<string, any> = {};
    for (const [key, field] of Object.entries(contented.pipeline.fields)) {
      const resolved = (await field.resolve?.(contented.fields[key], tree, file)) ?? contented.fields[key];
      if (isTypeValid(field.type, resolved)) {
        fields[key] = resolved;
      } else {
        fields[key] = undefined;

        if (field.required) {
          contented.errors.push({
            type: 'fields',
            reason: `required.${key}`,
          });
        }
      }
    }
    contented.fields = fields;
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
