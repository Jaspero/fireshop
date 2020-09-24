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
]
