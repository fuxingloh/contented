export default {
  processor: {
    pipelines: [
      {
        pattern: ['./**/*.md'],
        processor: 'md',
      },
    ],
  },
};
