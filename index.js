const path = require('path');
const { checkDependencies } = require('./src/check-dependencies');

const datWrapper = require('./src/dat-wrapper');

const DEFAULT_DAT_JAR_PATH = path
  .join(__dirname, 'lib/DicomAnonymizerTool/DAT.jar')
  .replace('app.asar', 'app.asar.unpacked');

module.exports = (_settings = {}) => {
  const settings = Object.assign(_settings, { jarPath: _settings.jarPath || DEFAULT_DAT_JAR_PATH });
  // get function which uses passed settings
  const checkDependenciesWrapped = (() => (callback) => {
    checkDependencies(settings)
      .then((deps) => callback(null, deps))
      .catch((err) => callback(err));
  })();
  return {
    checkDependencies: checkDependenciesWrapped,
    anonymize: datWrapper(settings).anonymize,
  };
};
