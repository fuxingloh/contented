[Contented](https://contented.dev) is a Markdown-based authoring workflow that encourage developer authoring within
its contextual Git repository. `npm i @birthdayresearch/contented`

With a headless design of 2 config files `package.json` & `contented.js`, developers can start writing their markdown
content and preview it on their localhost `contented write`. Choosing convention over configuration reduces HTML/UI
clutter, allowing developers to focus on authoring.

Authored content can be continuously delivered (CD) into a hosted static site (e.g., GitHub Pages/Netlify/Vercel) for
preview `contented generate`. As code drift, so does documentation; this allows each pull request to have an
accompanying sharable preview of the documentation. With CD, it effectively shift-left your documentation workflow and
checks it is compilable and presentable.

By encouraging authoring next to the source (in the same git repo), developers can contextually document changes as they
develop. All domain-specific changes will go into the `main` branch with one Git Pull Request.

With `contented build`, you can compile your markdown into sources `index.js` & `*.json` with `*.d.ts` that output
into `./dist`. `npm publish` them into any registry of your choice, for you can
easily `npm i @your-scope/your-npm-package` and use the processed content on any of your downstream sites. Easily
pulling up-to-date content and prose from individual domain-specific repositories and re-presented. Think microservices,
but for your prose!

## Motivation

If you don’t make it easy to get something done (authoring), nobody will go out of their way to get it done perfectly
every time. Turn it into a GitOps workflow and give people the necessary tools and power to get it done perfectly every
single time — everyone will get it done, as now there is no other way else to get it done. An efficient workflow
naturally satisfies.

### Just Another SSG?

**This is not a static site generator.** This is a markdown processor workflow with a built-in static site generator.
The outcome we're trying to achieve is
this [@birthdayresearch/contented-example/dist](https://www.jsdelivr.com/package/npm/@birthdayresearch/contented-example)

## Getting Started

```text
repo/
├─ packages/**          <- Project Tree
├─ docs/                <- Documentation Tree (standalone)
│  ├─ 01:Title 1/*.md
│  ├─ 02:Title 2/*.md
│  ├─ 03:Title 3/
│  │  ├─ 01:Subtitle 1/*.md
│  │  ├─ 02:overview.md
│  │  └─ 03:faq.md
│  ├─ contented.js
│  └─ package.json
├─ package.json
└─ README.md
```

**package.json**

```json
{
  "name": "@birthdayresearch/contented-example",
  "version": "0.0.0",
  "private": false,
  "files": ["dist"],
  "main": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "write": "contented write",
    "generate": "contented generate",
    "build": "contented build"
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

**contented.js**

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

### Examples

- [BirthdayResearch/contented/packages/contented-example](https://github.com/BirthdayResearch/contented/tree/main/packages/contented-example)
- [fuxingloh/jellyfishsdk-docs](https://github.com/fuxingloh/jellyfishsdk-docs)
