export function unpackGenerateImageString(data: string) {
  const [filePrefix, height, width, webpVersion] = data.split('---');

  return {
    filePrefix,
    height: parseInt(height, 10),
    width: parseInt(width, 10),
    webpVersion
  };
}
