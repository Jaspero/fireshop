/**
 * Only changes in these folders trigger deployments
 */
const includedFolders = [
  {f: 'callable', p: 'cms'},
  {f: 'triggers', p: 'cms'},
  {f: 'rest', p: 'cms'}
];

const camelize = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const changes = [
  ...JSON.parse(process.argv[2]),
  ...JSON.parse(process.argv[3])
]
  .reduce((acc, path) => {
    const folderMatch = includedFolders.find(({f}) =>
      path.startsWith(`functions/src/${f}`)
    );

    if (folderMatch) {
      let fileName = path
        .split('/')
        .pop()
        .split('.');

      fileName.pop();

      fileName = camelize(fileName.join('.'));

      if (folderMatch.p) {
        fileName = folderMatch.p + '.' + fileName;
      }

      acc.push(`functions:${fileName}`);
    }

    return acc;
  }, [])
  .join(',');

console.log(changes);
