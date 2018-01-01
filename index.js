const fs = require('fs');
const path = require('path');
const javaVersion = require('./java-version');

const DEFAULT_DAT_JAR_PATH = path.join(__dirname, 'lib/DicomAnonymizerTool/DAT.jar');

function checkDependencies(settings = {}) {
  /**
   * Ensure Java installed, DAT jar available
   */
  let dependencies = {
    Java: null,
    DicomAnonymizerTool: null,
  };

  return new Promise((resolve, reject) => {
    javaVersion((err, version) => {
      if (err) {
        return reject(err);
      }
      dependencies.Java = version;

      fs.access(settings.jarPath, (err) => {
        if (!err) {
          dependencies.DicomAnonymizerTool = 'Jarfile found';
        }
        return resolve(dependencies);
      });
    });
  });
}

module.exports.checkDependencies = (_settings = {}, callback) => {
  const settings = Object.assign(_settings, { jarPath: _settings.jarPath || DEFAULT_DAT_JAR_PATH });

  const print = (deps) => {
    const depString = `Dependencies:
    Java: ${deps.Java}
    DicomAnonymizerTool: ${deps.DicomAnonymizerTool}`;
    console.log(depString);
  }
  const check = async function check () {
    const deps = await checkDependencies(settings);

    if (settings.verbose) {
      print(deps);
    }
    return deps;
  }
  if (callback && typeof callback === 'function') {
    return check().then(r => callback(null, r)).catch(e => callback(e));
  }
  return check();
}

module.exports.anonymize = (_settings) => {
  const settings = Object.assign(_settings, { jarPath: _settings.jarPath || DEFAULT_DAT_JAR_PATH });
  const DATWrapper = require('./dat-wrapper')(settings);

  return DATWrapper.anonymize;
};
