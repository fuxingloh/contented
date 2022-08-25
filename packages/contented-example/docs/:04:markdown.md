---
title: Markdown Features
description: The dialect of Markdown that is currently supported for contented
tags: ['Markdown', 'Frontmatter', 'Admonitions', 'Mermaid']
---

Contented [unified](https://www.npmjs.com/package/unified) processor pipeline.

```js
processor
  .use(options.before)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkDirectiveRehype)
  .use(collectFields)
  .use(resolveFields)
  .use(validateFields)
  .use(options.remarks)
  .use(remarkRehype)
  .use(options.rehypes)
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
      A-->B;
      A-->C;
      B-->D;
      C-->D;
```
