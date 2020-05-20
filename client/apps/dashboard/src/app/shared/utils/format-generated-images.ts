import {GeneratedImage} from '../interfaces/generated-image.interface';

export function formatGeneratedImages(data: GeneratedImage[]) {
  return data.reduce((acc, cur, index) => {
    acc[`generate_${index + 1}`] = Object.entries(cur).reduce(
      (generated, [key, value]) => {
        generated += `----${key}:${value}`;
        return generated;
      },
      ''
    );
    return acc;
  }, {}) as {
    [key: string]: string;
  };
}
