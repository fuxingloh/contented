/** @type {import('@birthdayresearch/contented').ContentedConfig} */
const config = {
  processor: {
    pipelines: [
      {
        pattern: ['./**/*.md'],
        processor: 'md',
      },
    ],
  },
};

export default config;
