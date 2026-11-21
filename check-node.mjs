// Stops before the tests with a clear message when the installed Node is not version 24.
const major = Number(process.versions.node.split('.')[0]);
if (major !== 24) {
  console.error(`This project needs Node 24; you have ${process.version}.`);
  process.exit(1);
}
