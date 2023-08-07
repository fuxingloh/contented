---
description: The dialect of Markdown that is currently supported for contented
tags: ['Markdown', 'Frontmatter', 'Admonitions', 'Mermaid']
---

# Markdown Features

Contented [unified](https://www.npmjs.com/package/unified) processor pipeline.

```js
processor
  .use(options.before)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkParse)
  .use(remarkLink)
  .use(remarkDirective)
  .use(remarkDirectiveRehype)
  .use(collectFields)
  .use(resolveFields)
  .use(validateFields)
  .use(options.remarks)
  .use(remarkRehype)
  .use(options.rehypes)
  .use(rehypeExternalLinks, { target: '_blank' })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeToc)
  .use(rehypeHeading)
  .use(rehypeMermaid)
  .use(rehypeShiki, { highlighter })
  .use(rehypeStringify)
  .use(options.after);
```

## GitHub Flavour Markdown

[GitHub Flavored Markdown](https://github.github.com/gfm/), often shortened as GFM, is the dialect of Markdown that is
currently supported for user content on GitHub.com and GitHub Enterprise.

This formal specification, based on the CommonMark Spec, defines the syntax and semantics of this dialect.

## Frontmatter

```markdown
---
title: Markdown Flavour
---
```

## Linking

```md
[Heading](#linking)
[External](https://example.com)
[Relative Example 1](relative)
[Relative Example 2](to/folder/page-1)
[Relative Example 3](../back/page-3)
```

It is highly recommended to use relative links for internal linking and avoid using absolute links.
This is because contented pipelines are designed to be portable and can be deployed to different sites or domains.
By using absolute links, you're assuming that the content will always be deployed to the same domain or the same path.
When using relative links, contented will automatically resolve the links to the correct destination.

For example:

```js
/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  preview: {
    url: 'https://preview.contented.dev',
    name: 'Preview Contented',
  },
  processor: {
    rootDir: '../docs',
    pipelines: [
      {
        type: 'ExampleType',
        pattern: 'example-docs/**/*md',
        processor: 'md',
        transform: (file) => {
          // Notice that the path example-docs/ is removed. There is no way to know how you path is structured.
          // You need therefore use relative links that works universally across all sites.
          // This is intentional to make contented pipelines portable.
          file.path = file.path.replaceAll(/^\/example-docs\/?/g, '/');
          file.sections = file.sections.slice(1);
          return file;
        },
      },
    ],
  },
};

export default config;
```

```txt
Pipeline Processed:                 -> /[path] (note docs/example-docs/ is removed)
/docs/example-docs/page-1           -> /page-1
/docs/example-docs/page-2           -> /page-2
/docs/example-docs/folder/page-3    -> /folder/page-3

Preview:                            -> https://preview.contented.dev/[type]/[path]
/page-1                             -> https://preview.contented.dev/example/page-1
/page-2                             -> https://preview.contented.dev/example/page-2
/folder/page-3                      -> https://preview.contented.dev/example/folder/page-3

Another Site:                       -> https://developer-docs.com/product-example/docs/[path]
/page-1                             -> https://developer-docs.com/product-example/docs/page-1
/page-2                             -> https://developer-docs.com/product-example/docs/page-2
/folder/page-3                      -> https://developer-docs.com/product-example/docs/folder/page-3
```

Note how "Another Site" consumed the same contented pipeline but deployed to a different domain and path with its own
custom prefix. If you used absolute links, the links would be broken.

It is also highly advised against linking to another `"Type"` as you're assuming that the other site will be
structured the same way as your site with the same prefix or even publishing that `"Type"` at all.

## Admonitions

Admonitions with `remark-directive` and `remark-directive-rehype`.

::::div{class="admonitions"}
This is `div{class="admonitions"}`.

```markdown
:::div{class="admonitions"}
This is `div{class="admonitions"}`.
:::
```

::::

::::div{class="admonitions red"}
This is `div{class="admonitions red"}`.

```markdown
:::div{class="admonitions red"}
This is `div{class="admonitions red"}`.
:::
```

::::

::::div{class="admonitions yellow"}
This is `div{class="admonitions yellow"}`.

```markdown
:::div{class="admonitions yellow"}
This is `div{class="admonitions yellow"}`.
:::
```

::::

::::div{class="admonitions green"}
This is `div{class="admonitions green"}`.

```markdown
:::div{class="admonitions green"}
This is `div{class="admonitions green"}`.
:::
```

::::

## Mermaid

````
```mermaid
graph LR
    Start --> Stop
```
````

```mermaid
graph LR
    Start --> Stop
```

````
```mermaid
  graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
```
````

```mermaid
  graph TD;
A --> B;
A --> C;
B --> D;
C --> D;
```
