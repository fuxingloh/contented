# Contented

[Contented](https://contented.dev) is a Markdown-based bundler for your documentation with pipeline driven
authoring-oriented workflow to encourage developer authoring within its contextual Git repository.

With a headless design of 1 config file `contented.config.mjs`, developers can start writing
their [markdown content](./04-markdown.md) and preview it on their localhost `contented generate --watch`.
Choosing convention over configuration reduces HTML/UI clutter, allowing developers to focus on authoring.

Authored content can be continuously delivered (CD) into a hosted static site (e.g., GitHub Pages/Netlify/Vercel) for
preview `contented generate`. As code drift, so does documentation; this allows each pull request to have an
accompanying sharable preview of the documentation. With CD, it effectively shift-left your documentation workflow and
checks it is compilable and presentable.

By encouraging authoring next to the source (in the same git repo), developers can contextually document changes as they
develop. All domain-specific changes will go into the `main` branch with one Git Pull Request.

With `contented build`, you can compile your markdown into sources `index.js` and `*.json`. That output
into `./dist` to `npm publish` them into any registry of your choice, for you can
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
this [@contentedjs/contented-example/dist](https://www.jsdelivr.com/package/npm/@contentedjs/contented-example)

> [See Contented Limitations](./09-Others/02-limitations.md)

## Powered By

- [Next](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/)
- [@babel/generator](https://babeljs.io/docs/en/babel-generator)
- [unified](https://www.npmjs.com/package/unified)

## Getting Started

Your docs can be anywhere as long as contented is configured to pick them up.

```text
repo/
├─ packages/**
├─ docs/
│  ├─ 01:Title 1/*.md
│  ├─ 02:Title 2/*.md
│  ├─ 03:Title 3/
│  │  ├─ 01:Subtitle 1/*.md
│  │  ├─ 02:overview.md
│  │  └─ 03:faq.md
│  └─ package.json
├─ contented.config.mjs
├─ package.json
└─ README.md
```

**package.json**

```json
{
  "name": "@contentedjs/contented-example",
  "version": "0.0.0",
  "private": false,
  "files": ["dist"],
  "main": "dist/index.js",
  "scripts": {
    "write": "contented generate --watch",
    "generate": "contented generate",
    "build": "contented build"
  },
  "devDependencies": {
    "@contentedjs/contented": "latest"
  }
}
```

**contented.config.mjs**

```js
/** @type {import('@contentedjs/contented').ContentedConfig} */
export default {
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
    ],
  },
};
```

### Examples

- [developer.levain.tech](https://developer.levain.tech) Website Built with Contented
- [levaintech/contented/packages/contented-example](https://github.com/levaintech/contented/tree/main/packages/contented-example)
- [levaintech/sticky/packages/docs](https://github.com/levaintech/sticky/tree/main/packages/docs)
- [fuxingloh/jellyfishsdk-docs](https://github.com/fuxingloh/jellyfishsdk-docs)
