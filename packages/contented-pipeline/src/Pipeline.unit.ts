import { ContentedPipeline } from './Pipeline';
import { FileContent } from './PipelineFile';

class TestPipeline extends ContentedPipeline {
  processFile(): Promise<FileContent | undefined> {
    return Promise.resolve(undefined);
  }
}

it('should be extendable', async () => {
  const pipeline = new TestPipeline({
    type: 'Type',
    pattern: '**/*.md',
    processor: 'md',
  });

  expect(pipeline.type).toStrictEqual('Type');
  expect(await pipeline.process('1', '2')).toBeUndefined();
});
