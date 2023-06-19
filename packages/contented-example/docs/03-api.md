# API Reference

## Contented CLI

### contented write

To ease the authoring process, `content write` creates a preview of your content on `localhost:3000`. The preview comes
with a basic content navigation tree (left), table of contents (right), and prose formatting (center).

This website, the current one **you're looking at right now** is the result of `contented write`.

### contented generate

Generates the static preview website that can be published to GitHub Pages, Netlify, or Vercel! Minimally, you need to
configure your `package.json` with these fields:

**`package.json`:**

```json
{
  "scripts": {
    "generate": "contented generate"
  },
  "devDependencies": {
    "@contentedjs/contented": "latest"
  }
}
```

**`contented.config.js`:**

```js
/** @type {import('@contentedjs/contented').ContentedConfig} */
module.exports = {
  preview: {
    url: 'https://contented.dev',
    name: 'Contented',
    github: {
      url: 'https://github.com/levaintech/contented',
    },
  },
  processor: {
    pipelines: [
      {
        type: 'Doc',
        pattern: '**/*.md',
        processor: 'md',
      },
    ],
  },
};
```

**Netlify TOML:**

```toml
[build]
publish = ".contented/.preview/out"
command = "npm run generate"
```

**Vercel Settings:**

```text
FRAMEWORK PRESET    = Next.js
BUILD COMMAND       = npm run generate
OUTPUT DIRECTORY    = .contented/.preview/out
```

### contented build

Generates the `./dist` output that can be published into the NPM registry for creating a derivative site. Minimally, you
need to configure your `package.json` with these fields:

```json
{
  "name": "@your-scope/your-npm-package",
  "files": ["dist"],
  "main": "dist/index.js",
  "scripts": {
    "build": "contented build"
  },
  "devDependencies": {
    "@contentedjs/contented": "latest"
  }
}
```

Run `contented build` to compiled your markdown into `index.js` and `*.json`, output to the dir: `./dist`.
You can `npm publish` into any registry of your choice. You can easily `npm i @your-scope/your-npm-package` and use the
processed content on any downstream site.

```js
import { Index } from '@your-scope/your-npm-package';
```

## Contented Configuration

The anatomy of a contented package, with just 2 configuration files, and you are good from the get-go! Contented
automatically ignore files in your `.gitignore` and `.contentedignore`.

> You should also add a `.gitignore` too with `echo "dist\n.contented" > .gitignore`. (Okay fine! 3 files it is. Ughhhh)

### `contented.config.js`

```typescript
export interface ContentedConfig {
  preview: {
    url?: string;
    name?: string;
    github?: {
      url?: string;
    };
  };
  processor: {
    /**
     * The root directory of your contented markdown.
     */
    rootDir?: string;
    /**
     * Customize the output path. Editing this will cause contented-preview to break.
     */
    outDir?: string;
    /**
     * Contented processing pipeline
     */
    pipelines: Pipeline[];
  };
}

export interface Pipeline {
  type: string;
  pattern: string;
  processor: 'md';
  fields?: {
    [name: string]: PipelineField;
  };
  transform?: (file: FileContent) => Promise<FileContent>;
}
```

#### Example

```js
/** @type {import('@contentedjs/contented').ContentedConfig} */
module.exports = {
  preview: {
    url: 'https://contented.dev',
    name: 'Contented',
    github: {
      url: 'https://github.com/levaintech/contented',
    },
  },
  processor: {
    pipelines: [
      {
        type: 'Docs',
        pattern: 'docs/**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
            required: true,
            resolve: (s) => s ?? 'Contented',
          },
          description: {
            type: 'string',
          },
          tags: {
            type: 'string[]',
          },
        },
        transform: (file) => {
          file.path = file.path.replaceAll(/^\/docs\/?/g, '/');
          file.sections = file.sections.slice(1);
          return file;
        },
      },
      {
        type: 'Lorem',
        pattern: 'lorem/**/*.md',
        processor: 'md',
        fields: {
          title: {
            type: 'string',
          },
        },
        transform: (file) => {
          file.sections = file.sections.slice(1);
          return file;
        },
      },
    ],
  },
};
```
