import { ComputedFields, LocalDocument } from "@contentlayer/source-files";
import fs from "node:fs/promises";
import path from "node:path";

export async function getLastEditedDate(
  contentDirPath: string,
  meta: LocalDocument
): Promise<Date> {
  // eslint-disable-next-line no-underscore-dangle
  const stats = await fs.stat(
    path.join(contentDirPath, meta._raw.sourceFilePath)
  );
  return stats.mtime;
}

export function computeLastEditedDate(
  contentDirPath: string
): ComputedFields[string] {
  return {
    type: "date",
    description:
      "The last edited date of the file computed from fs.stat(meta._raw.sourceFilePath).",
    resolve(doc: LocalDocument): Promise<Date> {
      return getLastEditedDate(contentDirPath, doc);
    },
  };
}
