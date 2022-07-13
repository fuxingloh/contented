import { join } from 'node:path';
// import { defineConfig, makeSource } from '@birthdayresearch/contented-processor';
import { makeSource } from 'contentlayer/source-files';

// /** @type {ContentedConfig} */
// const contentedConfig = require(join(process.env.CONTENTED_CWD, 'contented.js'));
//
// console.log(contentedConfig)
/**
 * For
 *
 * Define contentlayer.config.js from contented-example
 */
import { Doc } from '../contented-example/contented';


export default makeSource({
  contentDirPath: process.env.CONTENTED_CWD as string,
  contentDirInclude: ['docs'],
  documentTypes: [
    Doc,
  ],
  disableImportAliasWarning: true,
});
