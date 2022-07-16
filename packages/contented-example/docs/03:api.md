---
title: API Reference
---

## Contented CLI

### `contented write`

To ease the authoring process, `content write` creates a preview of your content on `localhost:3000`. The preview comes
with a basic content navigation tree (left), table of contents (right), and prose formatting (center).

This website, the current one **you're looking at right now** is the result of `contented write`.

### `contented generate`

Generates the static preview website that can be published to GitHub Pages, Netlify, or Vercel! Minimally, you need to
configure your `package.json` with these fields:

```json
{
  "scripts": {
    "generate": "contented generate"
  },
  "devDependencies": {
    "@birthdayresearch/contented": "0.0.0"
  },
  "contented": {
    "url": "https://contented.dev",
    "name": "Contented",
    "github": {
      "url": "https://github.com/BirthdayResearch/contented"
    }
  }
}
```

**Netlify TOML:**

```toml
[build]
publish = ".contented/out/"
command = "npm run generate"
```

**Vercel Settings:**

```text
FRAMEWORK PRESET    = Next.js
BUILD COMMAND       = npm run generate
OUTPUT DIRECTORY    = .contented/.next
```

### `contented build`

Generates the `./dist` output that can be published into the NPM registry for creating a derivative site. Minimally, you
need to configure your `package.json` with these fields:

```json
{
  "name": "@your-scope/your-npm-package",
  "files": ["dist"],
  "main": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "devDependencies": {
    "@birthdayresearch/contented": "latest"
  }
}
```

Run `contented build` to compiled your markdown into `index.js` & `*.json` with `*.d.ts`, output to the dir: `./dist`.
You can `npm publish` into any registry of your choice. You can easily `npm i @your-scope/your-npm-package` and use the
processed content on any downstream site.

```js
import { allDocuments } from '@your-scope/your-npm-package';
```

## Contented Configuration

The anatomy of a contented package, with just 2 configuration files, and you are good from the get-go!

> You should also add a `.gitignore` too with `echo "dist\n.contented" > .gitignore`. (Okay fine! 3 files it is. Ughhhh)

### `contented.js`

```typescript
export interface ContentedConfig {
  /**
   * The root directory of your contented markdown. You can specify a sub-path.
   */
  rootDir: string;

  /**
   * Customizing the unified processor.
   */
  unified?: () => Promise<unified.Processor>;

  /**
   * Defining Contentlayer DocumentTypes.
   */
  types: import('contentlayer/source-files').DocumentTypes;
}
```

#### Example

```js
const Doc = {
  name: 'Doc',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the documentation.',
      required: true,
      default: 'Contented',
    },
    description: {
      type: 'string',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      default: [],
      required: false,
    },
  },
};

export default {
  rootDir: 'docs',
  types: [Doc],
};
```

### `package.json`

```typescript
export interface ContentedPreview {
  url?: string;
  name?: string;
  github?: {
    url?: string;
  };
}
```

#### Example

You configure the preview website through `package.json`:

```json
{
  "contented": {
    "url": "https://contented.dev",
    "name": "Contented",
    "github": {
      "url": "https://github.com/BirthdayResearch/contented"
    }
  }
}
```

## Powered By

- [Next](https://nextjs.org/), [Tailwind](https://tailwindcss.com/) for `contented write` and `contented generate`
- [Contentlayer](https://contentlayer.dev/) with a collection of Unified Plugin for MD processing for `contented build`
- And hacking around by spawning `node:child_process` so you just need 2 configuration files.
