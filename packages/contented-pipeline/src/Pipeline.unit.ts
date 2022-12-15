import { ContentedPipeline } from './Pipeline';
import { FileContent } from './PipelineFile';

class TestPipeline extends ContentedPipeline {
  processFileIndex(): Promise<FileContent[]> {
    return Promise.resolve([]);
  }
}

it('should be extendable', async () => {
  const pipeline = new TestPipeline(__dirname, {
    type: 'Type',
    pattern: '**/*.md',
    processor: 'md',
  });

  expect(pipeline.type).toStrictEqual('Type');
});

it('should replace numeric prefix path', () => {
  const pipeline = new TestPipeline(__dirname, {
    type: 'Type',
    pattern: '**/*.md',
    processor: 'md',
  });

  expect(pipeline.getSanitizedPath('path-1.md')).toStrictEqual('path-1');

  expect(pipeline.getSanitizedPath(':01:path.md')).toStrictEqual('path');
  expect(pipeline.getSanitizedPath(':01path.md')).toStrictEqual('01path');

  expect(pipeline.getSanitizedPath('[01]path.md')).toStrictEqual('path');
  expect(pipeline.getSanitizedPath('01]path.md')).toStrictEqual('01-path');

  expect(pipeline.getSanitizedPath('(01)path.md')).toStrictEqual('path');
  expect(pipeline.getSanitizedPath('(01path.md')).toStrictEqual('01path');

  expect(pipeline.getSanitizedPath('01-path.md')).toStrictEqual('path');
  expect(pipeline.getSanitizedPath('01path.md')).toStrictEqual('01path');
  expect(pipeline.getSanitizedPath('01.md')).toStrictEqual('01');

  expect(pipeline.getSanitizedPath('01/01.md')).toStrictEqual('01/01');
  expect(pipeline.getSanitizedPath('Header/Path.md')).toStrictEqual('header/path');
  expect(pipeline.getSanitizedPath('Header/01-Path.md')).toStrictEqual('header/path');
  expect(pipeline.getSanitizedPath('01-Header/01-Path.md')).toStrictEqual('header/path');
  expect(pipeline.getSanitizedPath('01-Header/[01]Path.md')).toStrictEqual('header/path');
  expect(pipeline.getSanitizedPath('(01)Header/[01]Path.md')).toStrictEqual('header/path');
  expect(pipeline.getSanitizedPath(':01:Header/[01-Path.md')).toStrictEqual('header/01-path');
});
