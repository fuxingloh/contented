---
title: Markdown Features
---

```js
builder
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkDirectiveRehype)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeToc)
  .use(rehypeShiki, { highlighter })
  .use(rehypeStringify);
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
