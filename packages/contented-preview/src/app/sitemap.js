import { Index } from '../../../index.js';

export default function sitemap() {
  return [
    ...Index.map((fileIndex) => {
      const path = `/${file.type.toLowerCase()}${file.path}`
      return {
        url: `${process.env.CONTENTED_PREVIEW_SITE_URL}/${path}`,
        lastModified: new Date(fileIndex.modifiedDate),
        changeFrequency: 'weekly',
      };
    })
  ];
}
