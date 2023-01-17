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

it('should preserve internal links for files', () => {
  const pipeline = new TestPipeline(__dirname, {
    type: 'Type',
    pattern: '**/*.md',
    processor: 'md',
  });

  // With file extensions
  expect(pipeline.getSanitizedPath('path-1.md#content1')).toStrictEqual('path-1#content1');

  expect(pipeline.getSanitizedPath(':01:path.md#content1')).toStrictEqual('path#content1');
  expect(pipeline.getSanitizedPath(':01path.md#content1')).toStrictEqual('01path#content1');

  expect(pipeline.getSanitizedPath('[01]path.md#content1')).toStrictEqual('path#content1');
  expect(pipeline.getSanitizedPath('01]path.md#content1')).toStrictEqual('01-path#content1');

  expect(pipeline.getSanitizedPath('(01)path.md#content1')).toStrictEqual('path#content1');
  expect(pipeline.getSanitizedPath('(01path.md#content1')).toStrictEqual('01path#content1');

  expect(pipeline.getSanitizedPath('01-path.md#content1')).toStrictEqual('path#content1');
  expect(pipeline.getSanitizedPath('01path.md#content1')).toStrictEqual('01path#content1');
  expect(pipeline.getSanitizedPath('01.md#content1')).toStrictEqual('01#content1');

  expect(pipeline.getSanitizedPath('01/01.md#content1')).toStrictEqual('01/01#content1');
  expect(pipeline.getSanitizedPath('Header/Path.md#content1')).toStrictEqual('header/path#content1');
  expect(pipeline.getSanitizedPath('Header/01-Path.md#content1')).toStrictEqual('header/path#content1');
  expect(pipeline.getSanitizedPath('01-Header/01-Path.md#content1')).toStrictEqual('header/path#content1');
  expect(pipeline.getSanitizedPath('01-Header/[01]Path.md#content1')).toStrictEqual('header/path#content1');
  expect(pipeline.getSanitizedPath('(01)Header/[01]Path.md#content1')).toStrictEqual('header/path#content1');
  expect(pipeline.getSanitizedPath(':01:Header/[01-Path.md#content1')).toStrictEqual('header/01-path#content1');

  // Without file extensions
  expect(pipeline.getSanitizedPath('path01#content1')).toStrictEqual('path01#content1');
  expect(pipeline.getSanitizedPath('01-path#content1')).toStrictEqual('path#content1');
  expect(pipeline.getSanitizedPath('Header/01-Path#content1')).toStrictEqual('header/path#content1');
});
