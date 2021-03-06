export function unpackGenerateImageString(data: string) {
  return data.split('----').reduce((acc, cur) => {
    const [key, value] = cur.split(':');

    switch (key) {
      case 'filePrefix':
      case 'folder':
        acc[key] = value;
        break;
      case 'height':
      case 'width':
        let parsed = 0;

        try {
          parsed = parseInt(value, 10);
        } catch (e) {}

        if (parsed) {
          acc[key] = parsed;
        }

        break;
      case 'webpVersion':
        acc[key] = value === 'true';
        break;

      default:
        break;
    }

    return acc;
  }, {
    filePrefix: '',
    folder: '',
    height: 0,
    width: 0,
    webpVersion: false
  });
}
