import {GeneratedImage} from '../interfaces/generated-image.interface';

export function formatGeneratedImages(data: GeneratedImage[]) {
  return data.reduce((acc, cur, index) => {
    acc[`generate_${index + 1}`] = [
      cur.filePrefix,
      cur.height,
      cur.width,
      cur.webpVersion
    ].join('---');

    return acc;
  }, {});
}
