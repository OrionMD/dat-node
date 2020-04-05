const fs = require('fs-extra');
const javaVersion = require('./java-version');

async function checkDependencies(settings = {}) {
  /**
   * Ensure Java installed, DAT jar available
   */
  const dependencies = {
    Java: null,
    DicomAnonymizerTool: null,
  };

  dependencies.Java = await javaVersion();
  dependencies.DicomAnonymizerTool = (await fs.pathExists(settings.jarPath)) && 'Jarfile found';
  return dependencies;
}

function printFormattedDeps(deps) {
  const depString = `Dependencies:
    Java: ${deps.Java}
    DicomAnonymizerTool: ${deps.DicomAnonymizerTool}`;
  console.log(depString);
}

async function printDependencies(settings) {
  printFormattedDeps(await checkDependencies(settings));
}

module.exports = {
  checkDependencies,
  printDependencies,
};
