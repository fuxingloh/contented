import { join } from "node:path";
import { makeSource } from "contentlayer/source-files";
import contented from "./contented";

async function makeConfig() {
  return makeSource({
    contentDirPath: join(
      process.env.CONTENTED_CWD as string,
      contented.rootDir
    ),
    markdown: await contented.unified(),
    documentTypes: contented.types,
    onUnknownDocuments: "skip-ignore",
    disableImportAliasWarning: true,
  });
}

export default makeConfig();
