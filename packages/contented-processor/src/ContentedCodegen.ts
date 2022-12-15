import fs from 'node:fs/promises';
import { join } from 'node:path';

import { CodeGenerator } from '@babel/generator';
import { FileContent, FileIndex } from '@birthdayresearch/contented-pipeline';

import { Config } from './ContentedProcessor.js';

export class ContentedCodegen {
  constructor(protected readonly config: Config, protected readonly outPath: string) {}

  async generateIndex() {
    const types = this.config.pipelines.map((pipeline) => pipeline.type);
    const ast = generateIndexAST([...new Set(types)]);
    const outPath = join(this.outPath, `index.js`);
    await fs.mkdir(this.outPath, { recursive: true });
    await fs.writeFile(outPath, generate(ast).code);
  }

  async generatePipeline(type: string, contents: FileIndex[]) {
    await fs.mkdir(join(this.outPath, type), { recursive: true });

    const ast = generatePipelineAST(type, contents);
    const indexJs = join(this.outPath, type, `index.js`);
    await fs.writeFile(indexJs, generate(ast).code);

    const indexJson = join(this.outPath, type, `index.json`);
    await fs.writeFile(indexJson, JSON.stringify(contents));
  }

  async generateFile(content: FileContent) {
    const outPath = join(this.outPath, content.type, `${content.id}.json`);

    await fs.mkdir(join(this.outPath, content.type), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(content));
  }
}

function generatePipelineAST(type: string, contents: FileIndex[]): any {
  const importDeclaration = contents.map((content) => ({
    type: 'ImportDeclaration',
    specifiers: [
      {
        type: 'ImportDefaultSpecifier',
        local: { type: 'Identifier', name: `_${content.id}` },
      },
    ],
    source: { type: 'StringLiteral', value: `./${content.id}.json` },
  }));

  const arrayElements = contents.map((content) => ({
    type: 'Identifier',
    name: `_${content.id}`,
  }));

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
  const indexJsImports = types.map((type) => ({
    type: 'ImportDeclaration',
    specifiers: [
      {
        type: 'ImportSpecifier',
        local: { type: 'Identifier', name: type },
        imported: { type: 'Identifier', name: type },
      },
    ],
    source: { type: 'StringLiteral', value: `./${type}/index.js` },
  }));

  const indexJsonImports = types.map((type) => ({
    type: 'ImportDeclaration',
    specifiers: [
      {
        type: 'ImportDefaultSpecifier',
        local: { type: 'Identifier', name: `${type}Index` },
      },
    ],
    source: { type: 'StringLiteral', value: `./${type}/index.json` },
  }));

  const exportJsDeclaration = types.map((type) => ({
    type: 'ExportSpecifier',
    local: { type: 'Identifier', name: type },
    exported: { type: 'Identifier', name: type },
  }));

  const exportJsonDeclaration = types.map((type) => ({
    type: 'ExportSpecifier',
    local: { type: 'Identifier', name: `${type}Index` },
    exported: { type: 'Identifier', name: `${type}Index` },
  }));

  const spreadElements = types.map((type) => ({
    type: 'SpreadElement',
    argument: {
      type: 'Identifier',
      name: `${type}Index`,
    },
  }));

  const objectProperties = types.map((type) => ({
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
  }));

  return {
    type: 'File',
    program: {
      type: 'Program',
      sourceType: 'module',
      body: [
        ...indexJsImports,
        ...indexJsonImports,
        {
          type: 'ExportNamedDeclaration',
          specifiers: exportJsDeclaration,
        },
        {
          type: 'ExportNamedDeclaration',
          specifiers: exportJsonDeclaration,
        },
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
                  name: 'Index',
                },
                init: {
                  type: 'ArrayExpression',
                  elements: spreadElements,
                },
              },
            ],
          },
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

function generate(ast: any) {
  const gen = new CodeGenerator(ast);
  return gen.generate();
}
