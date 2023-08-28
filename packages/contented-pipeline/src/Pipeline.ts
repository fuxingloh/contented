import { createHash } from 'node:crypto';
import { statSync } from 'node:fs';
import { join, parse, ParsedPath } from 'node:path';

import slugify from '@sindresorhus/slugify';

import { PipelineField } from './PipelineField.js';
import { FileContent, FileIndex } from './PipelineFile.js';

export interface Pipeline {
  type: string;
  dir?: string;
  pattern: string | string[];
  /**
   * Built in processor: 'md'
   * Otherwise it will `import(processor)` module with default exporting ContentedPipeline
   */
  processor: 'md' | 'jest-md' | (new (rootPath: string, pipeline: Pipeline) => ContentedPipeline);
  fields?: {
    [name: string]: PipelineField;
  };
  transform?: (file: FileContent, filePath: string) => Promise<FileContent>;
  sort?: (a: FileIndex, b: FileIndex) => number;
}

/**
 * Contented Pipeline (Path-based)
 */
export abstract class ContentedPipeline {
  public constructor(
    public readonly rootPath: string,
    public readonly pipeline: Pipeline,
  ) {
    pipeline.fields = {
      title: { type: 'string' },
      description: { type: 'string' },
      ...pipeline.fields,
    };
  }

  /**
   * Optional init for Pipeline that require async setup.
   */
  async init(): Promise<void> {} // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * @param {string} rootPath
   * @param {string} file to process
   * @return {FileContent[]} containing none, one or many FileContent
   */
  async process(rootPath: string, file: string): Promise<FileContent[]> {
    if (this.pipeline.dir) {
      // When pipeline.dir is set, we need to recompute the file path
      const filePath = join(rootPath, file);
      rootPath = join(rootPath, this.pipeline.dir, '/');
      file = filePath.replace(rootPath, '');
    }

    const fileIndex = await this.newFileIndex(rootPath, file);
    const contents = await this.processFileIndex(fileIndex, rootPath, file);
    if (contents === undefined) {
      return [];
    }
    if (this.pipeline.transform === undefined) {
      return contents;
    }
    return Promise.all(contents.map((content) => this.pipeline.transform!(content, file)));
  }

  /**
   * @param fileIndex is the pre-computed FileIndex of the file
   * @param rootPath is the root path of the pipeline
   * @param file is the file to process
   */
  protected abstract processFileIndex(fileIndex: FileIndex, rootPath: string, file: string): Promise<FileContent[]>;

  get type(): string {
    return this.pipeline.type;
  }

  sort(files: FileIndex[]): FileIndex[] {
    if (!this.pipeline.sort) {
      return files;
    }
    return files.sort(this.pipeline.sort);
  }

  protected async newFileIndex(rootPath: string, file: string): Promise<FileIndex> {
    const filePath = join(rootPath, file);
    const parsedPath = parse(file);
    const sections = this.computeSections(parsedPath);

    return {
      fileId: this.computeFileId(filePath),
      type: this.type,
      path: `/${this.computePath(sections, parsedPath)}`,
      modifiedDate: await this.computeModifiedDate(filePath),
      sections,
      fields: {},
    };
  }

  /**
   * @param {string} file
   * @return {string} fully sanitized file path
   */
  public getSanitizedPath(file: string): string {
    const parsedPath = parse(file);
    const sections = this.computeSections(parsedPath);
    return this.computePath(sections, parsedPath);
  }

  protected computePath(sections: string[], parsedPath: ParsedPath) {
    const dir = `${sections.map((s) => (s !== '..' ? slugify(s) : s)).join('/')}`;
    const file = this.computeFileName(parsedPath.name);
    const fileFragment = this.computeFileFragment(parsedPath);
    if (file === 'index') {
      return `${dir}${fileFragment}`;
    }

    if (dir === '') {
      return `${file}${fileFragment}`;
    }

    return `${dir}/${file}${fileFragment}`;
  }

  protected computeSections(parsedPath: ParsedPath) {
    if (parsedPath.dir === '') {
      return [];
    }

    return parsedPath.dir.split('/').map(this.replacePrefix);
  }

  protected replacePrefix(path: string): string {
    const matched = path.match(/^(:\d+:|\(\d+\)|\[\d+]|\d+-)(.+)$/);
    if (matched !== null) {
      return matched[2];
    }
    return path;
  }

  /**
   * Compute the file name without any linking.
   * Do use this instead of extracting manually.
   * @param rawFileName The raw file name from ParsedPath
   */
  protected computeFileName(rawFileName: string): string {
    if (rawFileName.includes('#')) {
      const splitNames = rawFileName.split('#');

      /**
       * We only want it if its exactly length of 2.
       * Title#subtile is valid, but Title#subtitle#whatisthis should not be valid.
       * If its not valid just use the name as it is.
       */
      if (splitNames.length === 2) {
        return `${slugify(this.replacePrefix(splitNames[0]))}`;
      }
    }
    return `${slugify(this.replacePrefix(rawFileName))}`;
  }

  /**
   * Extract the fragment identifier from the read file.
   * Depending if extension of the files are provided,
   * the fragment identifier will be in ext or the file name.
   * @param parsedPath
   */
  protected computeFileFragment(parsedPath: ParsedPath): string {
    if (parsedPath.ext !== '' && parsedPath.ext.includes('#')) {
      const linkMatches = parsedPath.ext.match(/^(\.\w+)(#.+)*$/);
      if (linkMatches !== null) {
        return linkMatches[2] ?? '';
      }
    }

    if (parsedPath.name !== '' && parsedPath.name.includes('#')) {
      const splits = parsedPath.name.split('#');

      /**
       * We only want it if its exactly length of 2.
       * Title#subtile is valid, but Title#subtitle#whatisthis should not be valid
       */
      if (splits.length === 2) {
        return `#${splits[1]}`;
      }
    }

    return '';
  }

  protected computeFileId(filePath: string) {
    return createHash('sha256').update(filePath).digest('hex');
  }

  protected async computeModifiedDate(filePath: string): Promise<number> {
    const stats = statSync(filePath);
    return stats.mtime.getTime();
  }
}
