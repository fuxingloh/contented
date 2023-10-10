import { createHash } from 'node:crypto';
import { accessSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, parse as parsePath } from 'node:path';

import { Image, Parent } from 'mdast';
import { Transformer } from 'unified';
import { Node } from 'unist';
import { map } from 'unist-util-map';
import { VFile } from 'vfile';

import { UnifiedContented } from './Plugin.js';

export function remarkImage(): Transformer<Parent> {
  return (tree: Parent, file): Parent => map<Node>(tree, mapLocalImage(file)) as Parent;
}

function mapLocalImage(file: VFile): (node: Node) => Node {
  const contented = file.data?.contented as UnifiedContented;
  const absoluteDir = parsePath(
    join(contented.contentedPipeline.rootPath, contented.pipeline.dir ?? '', contented.filePath),
  ).dir;
  const outDir = join(contented.contentedPipeline.outPath, contented.pipeline.type, 'images');

  return (node): Node => {
    if (node.type !== 'image') {
      return node;
    }
    const image = node as Image;
    const imageAbsolutePath = join(absoluteDir, image.url);
    if (!imageExists(imageAbsolutePath)) {
      return node;
    }

    const imageId = createHash('sha256').update(imageAbsolutePath).digest('hex');
    const imageExt = parsePath(imageAbsolutePath).ext;
    const outputPath = join(outDir, `${imageId}${imageExt}`);
    mkdirSync(outDir, { recursive: true });
    copyFileSync(imageAbsolutePath, outputPath);

    return {
      ...node,
      url: `./images/${imageId}${imageExt}`,
    } as Image;
  };
}

function imageExists(path: string): boolean {
  try {
    accessSync(path);
    return true;
  } catch {
    return false;
  }
}
