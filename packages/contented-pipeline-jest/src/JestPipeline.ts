import { MarkdownPipeline } from '@birthdayresearch/contented-pipeline-md';
import { join, ParsedPath } from 'node:path';
import { VFile } from 'vfile';
import { readFile, writeFile } from 'node:fs/promises';
import { File, SourceLocation } from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import stripIndent from 'strip-indent';

export class JestPipeline extends MarkdownPipeline {
  protected override computePath(sections: string[], parsedPath: ParsedPath): string {
    const path = super.computePath(sections, parsedPath);
    return path.replaceAll(/-(unit|i9n|e2e|integration|test|tests|spec)$/g, '');
  }

  protected override async readVFile(rootPath: string, file: string): Promise<VFile | undefined> {
    const path = join(rootPath, file);
    const contents = await readFile(path, { encoding: 'utf-8' });
    const ast = parse(contents, { sourceType: 'unambiguous' });
    const lines = contents.split('\n');

    const comments = this.collectComments(ast) ?? [];
    const value = this.mergeCodeblock(lines, comments).join('\n\n');

    await writeFile('jest-pipeline.md', value);

    return new VFile({
      path: path,
      value: value,
    });
  }

  protected collectComments(ast: File): NormalizedComment[] | undefined {
    return ast.comments
      ?.map((comment) => {
        return {
          content: this.normalizeText(comment.value),
          index: comment.loc?.start.line,
        };
      })
      .filter((value) => value.index !== undefined) as NormalizedComment[];
  }

  /**
   * Remove first `*\n` that is part of /**
   * Remove each  ` * ` that is part of  *
   */
  protected normalizeText(text: string) {
    text = text.replaceAll(/^ *\* *\n/g, '');

    const content = text
      .split('\n')
      .map((value) => value.replaceAll(/^ *\* */g, ''))
      .join('\n');
    return stripIndent(content);
  }

  protected mergeCodeblock(lines: string[], comments: NormalizedComment[]): string[] {
    const collected: string[] = [];
    let codeblockStart: number | undefined = undefined;

    for (const comment of comments) {
      if (comment.content === '@contented codeblock:start') {
        codeblockStart = comment.index;
      } else if (comment.content === '@contented codeblock:end') {
        if (codeblockStart !== undefined) {
          const codeblock = lines.slice(codeblockStart, comment.index - 1).join('\n');
          collected.push('```ts\n' + stripIndent(codeblock) + '\n```');
        }
        codeblockStart = undefined;
      } else {
        collected.push(comment.content);
      }
    }

    return collected;
  }
}

interface NormalizedComment {
  content: string;
  index: number;
}
