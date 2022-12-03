/** @type {import('@birthdayresearch/contented').ContentedConfig} */
const config = {
  processor: {
    pipelines: [
      {
        type: 'Lorem',
        pattern: ['./**/*.md'],
        processor: 'md',
      },
    ],
  },
};

export default config;
