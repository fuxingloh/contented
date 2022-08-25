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

    const nodes = this.collectNodes(ast);
    const comments = this.collectComments(ast) ?? [];
    const value = this.mergeCodeblock(nodes, comments).join('\n\n');

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
          index: comment.end,
        };
      })
      .filter((value) => value.index !== undefined) as NormalizedComment[];
  }

  protected collectNodes(ast: File) {
    const nodes: NodePath[] = [];
    traverse(ast, {
      enter(path) {
        path.node.leadingComments = [];
        path.node.trailingComments = [];
        nodes.push(path);
      },
    });
    return nodes;
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

  protected mergeCodeblock(nodes: NodePath[], comments: NormalizedComment[]): string[] {
    const lines: string[] = [];
    for (const comment of comments) {
      if (comment.content === '@contented codeblock') {
        const node = nodes.find((value) => {
          return !value.node.start ? false : value.node.start > comment.index;
        });
        if (node) {
          lines.push('```ts\n' + generate(node.node, { retainLines: true }).code + '\n```');
        }
      } else {
        lines.push(comment.content);
      }
    }
    return lines;
  }
}

interface NormalizedComment {
  content: string;
  index: number;
}
