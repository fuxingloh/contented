# RemarkDirective

::::codeblock-group

:::codeblock-header{filename="example.ts" language="TypeScript"}

```ts
const a: number = 1;
const b: number = 2;
```

:::

:::codeblock-header{filename="example.js" language="JavaScript"}

```js
const a = 1;
const b = 2;
```

:::

::::

```txt
case 'div':
case 'table':
case 'tr':
case 'td':
case 'th':
case 'tbody':
case 'thead':
case 'tfoot':
```

Should only parse the tags above.

:::div{onClick="alert('clicked')"}
Should not parse onClick.
:::

:::script
Should not parse script tags.
:::

:::div{.admonitions.green}
This is `div{.admonitions.green}`.
:::
