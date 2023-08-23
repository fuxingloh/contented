/**
 * # Jest Markdown Pipeline (JS)
 *
 * JavaScript version of the Jest Markdown Pipeline.
 * The file extension will be used to determine the language of the codeblocks.
 *
 * For example:
 * - `*.js` will be parsed as ```` ```js ````
 * - `*.ts` will be parsed as ```` ```ts ````
 * - `*.tsx` will be parsed as ```` ```tsx ````
 */
it('true to be true', () => {
  // :::codeblock-header{filename="Expect.js" language="JavaScript"}
  // @contented codeblock:start
  expect(true).toStrictEqual(true);
  // @contented codeblock:end
  // :::
});
