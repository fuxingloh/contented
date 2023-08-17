import { join, parse as parsePath, relative } from 'node:path';
import { parse } from 'node:url';

import { Link, Parent } from 'mdast';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { UnifiedContented } from './Plugin.js';

export function remarkLink(): Transformer<Parent> {
  return (tree, file) => {
    visit(tree, 'link', visitLink(file));
  };
}

function visitLink(file: VFile): (node: Link) => void {
  const contented = file.data?.contented as UnifiedContented;

  return (node) => {
    if (parse(node.url).hostname !== null) {
      return;
    }

    const path = node.url;
    if (path.startsWith('./')) {
      const pipelineDir = join(
        contented.contentedPipeline.rootPath,
        contented.contentedPipeline.pipeline.dir ?? '',
        '/',
      );
      const parsedPath = parsePath(join(pipelineDir, contented.filePath));
      const linkedFilePath = join(pipelineDir, path);
      const relativePath = relative(parsedPath.dir, linkedFilePath);
      node.url = contented.contentedPipeline.getSanitizedPath(relativePath);
    } else {
      node.url = contented.contentedPipeline.getSanitizedPath(path);
    }
  };
}
