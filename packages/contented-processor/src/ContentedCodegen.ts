import { FileContent, FileIndex } from './pipeline';
import { join } from 'node:path';
import { Config, ContentedProcessorResult } from './ContentedProcessor';
import fs from 'node:fs/promises';
import generate from '@babel/generator';

export class ContentedCodegen {
  public readonly outPath: string = join(process.cwd(), this.config.rootDir, this.config.outDir);

  constructor(protected readonly config: Config) {}

  async generateIndex() {
    const types = this.config.pipelines.map((pipeline) => pipeline.type);
    const ast = generateIndexAST(types);
    const outPath = join(this.outPath, `index.js`);
    await fs.mkdir(this.outPath, { recursive: true });
    await fs.writeFile(outPath, generate(ast).code);
  }

  async generatePipeline(type: string, contents: FileIndex[]) {
    const ast = generatePipelineAST(type, contents);

    const outPath = join(this.outPath, type, `index.js`);
    await fs.mkdir(join(this.outPath, type), { recursive: true });
    await fs.writeFile(outPath, generate(ast).code);
  }

  async generateFile(content: FileContent) {
    const outPath = join(this.outPath, content.type, `${content.id}.json`);

    await fs.mkdir(join(this.outPath, content.type), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(content));
  }
}

function generatePipelineAST(type: string, contents: FileIndex[]): any {
  const importDeclaration = contents.map((content) => {
    return {
      type: 'ImportDeclaration',
      specifiers: [
        {
          type: 'ImportDefaultSpecifier',
          local: { type: 'Identifier', name: `_${content.id}` },
        },
      ],
      source: { type: 'StringLiteral', value: `./${content.id}.json` },
    };
  });

  const arrayElements = contents.map((content) => {
    return {
      type: 'Identifier',
      name: `_${content.id}`,
    };
  });

  return {
    type: 'File',
    program: {
      type: 'Program',
      sourceType: 'module',
      body: [
        ...importDeclaration,
        {
          type: 'ExportNamedDeclaration',
          declaration: {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: type,
                },
                init: {
                  type: 'ArrayExpression',
                  elements: arrayElements,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function generateIndexAST(types: string[]): any {
  const importDeclaration = types.map((type) => {
    return {
      type: 'ImportDeclaration',
      specifiers: [
        {
          type: 'ImportSpecifier',
          local: { type: 'Identifier', name: type },
          imported: { type: 'Identifier', name: type },
        },
      ],
      source: { type: 'StringLiteral', value: `./${type}/index.js` },
    };
  });

  const exportSpecifiers = types.map((type) => {
    return {
      type: 'ExportSpecifier',
      local: { type: 'Identifier', name: type },
      exported: { type: 'Identifier', name: type },
    };
  });

  const objectProperties = types.map((type) => {
    return {
      type: 'ObjectProperty',
      key: { type: 'Identifier', name: type },
      value: {
        type: 'ObjectExpression',
        properties: [
          {
            type: 'ObjectProperty',
            key: { type: 'Identifier', name: 'collection' },
            value: { type: 'Identifier', name: type },
          },
        ],
      },
    };
  });

  return {
    type: 'File',
    program: {
      type: 'Program',
      sourceType: 'module',
      body: [
        ...importDeclaration,
        {
          type: 'ExportNamedDeclaration',
          specifiers: exportSpecifiers,
        },
        {
          type: 'ExportNamedDeclaration',
          exportKind: 'value',
          declaration: {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: 'Pipelines' },
                init: { type: 'ObjectExpression', properties: objectProperties },
              },
            ],
          },
        },
      ],
    },
  };
}