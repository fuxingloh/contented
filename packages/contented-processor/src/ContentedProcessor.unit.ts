import { ContentedProcessor, ContentedProcessorConfig } from './ContentedProcessor';

const config: ContentedProcessorConfig = {
  rootDir: './src',
  outDir: './.contented',
  pipeline: [{
    name: 'Markdown',
    pattern: '**/*.md',
    processor: 'md',
  }],
};


it('should build', function() {
  const processor = new ContentedProcessor(config);
  processor.build('ContentedProcessor.unit.md');
});