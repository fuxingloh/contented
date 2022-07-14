import { ComputedFields, LocalDocument } from '@contentlayer/source-files';
import slugify from '@sindresorhus/slugify';

export function computePath(prefix: string, replace: RegExp, replaceWith: string): ComputedFields[string] {
  return {
    type: 'string',
    description: 'The fully featured URL path of this document relative to site root.',
    resolve(doc: LocalDocument): string {
      // eslint-disable-next-line no-underscore-dangle
      const segments = doc._raw.flattenedPath.replaceAll(replace, replaceWith).split('/');
      return `${prefix}${segments.map((s) => slugify(s)).join('/')}`;
    },
  };
}

export function computeSections(ignorePrefix: RegExp, replace: RegExp, replaceWith: string): ComputedFields[string] {
  return {
    type: 'list',
    description: 'Sections of the document.',
    resolve(doc: LocalDocument): string[] {
      // eslint-disable-next-line no-underscore-dangle
      const dir = doc._raw.sourceFileDir.replaceAll(ignorePrefix, '');
      if (!dir) {
        return [];
      }
      return dir.replaceAll(replace, replaceWith).split('/');
    },
  };
}
