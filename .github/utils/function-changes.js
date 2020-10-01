/**
 * Only changes in these folders trigger deployments
 */
const includedFolders = [
  'callable',
  'triggers',
  'rest'
];

const changes = [
  ...JSON.parse(process.argv[2]),
  ...JSON.parse(process.argv[3])
].filter(change => includedFolders.some((folder) => change.startsWith(`functions/src/${folder}`)))
  .map(path => {
    const fileName = path.split('/').pop().split('.');
    fileName.pop();
    return fileName.join('.');
  }).join(',');

console.log(changes);
