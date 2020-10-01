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
].filter(change => {
  return includedFolders.some((folder) => {
    return change.startsWith(`function/src/${folder}`);
  });
})

console.log(changes);
