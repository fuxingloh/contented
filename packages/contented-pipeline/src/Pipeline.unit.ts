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
