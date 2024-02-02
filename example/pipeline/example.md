# Pipeline

You can create another pipeline by adding a new unique `type` field.
The same `type` are grouped together and processed in the order they are defined.

:::codeblock-header{filename="contented.config.mjs" language="JavaScript"}

```js
/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  processor: {
    pipelines: [
      {
        type: 'Contented',
        pattern: 'README.md',
        processor: 'md',
      },
      {
        type: 'Contented',
        dir: 'example/docs',
        pattern: '**/*.md',
        processor: 'md',
      },
      {
        type: 'Pipeline',
        dir: 'example/pipeline',
        pattern: ['**/*.md'],
        processor: 'md',
      },
    ],
  },
};

export default config;
```

:::
