/**
 * Only changes in these folders trigger deployments
 */
const includedFolders = [
  'callable',
  'triggers',
  'rest'
];

const camelize = s => s.replace(/-./g, x => x.toUpperCase()[1])

const changes = [
  ...JSON.parse(process.argv[2]),
  ...JSON.parse(process.argv[3])
].filter(change => includedFolders.some((folder) => change.startsWith(`functions/src/${folder}`)))
  .map(path => {
    const fileName = path.split('/').pop().split('.');
    fileName.pop();
    return camelize(fileName.join('.'));
  }).join(',');

console.log(changes);
