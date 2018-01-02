const fs = require('fs');
const path = require('path');
const javaVersion = require('./java-version');

const DEFAULT_DAT_JAR_PATH = path.join(__dirname, 'lib/DicomAnonymizerTool/DAT.jar');

function doCheckDependencies(settings = {}) {
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

function checkDependencies (settings, callback) {
  const print = (deps) => {
    const depString = `Dependencies:
    Java: ${deps.Java}
    DicomAnonymizerTool: ${deps.DicomAnonymizerTool}`;
    console.log(depString);
  }
  const check = async function check () {
    const deps = await doCheckDependencies(settings);

    if (settings.verbose) {
      print(deps);
    }
    return deps;
  }
  return function (callback) {
    if (callback && typeof callback === 'function') {
      return check().then(r => callback(null, r)).catch(e => callback(e));
    }
    return check();
  }
}

module.exports = (_settings = {}) => {
  const settings = Object.assign(_settings, { jarPath: _settings.jarPath || DEFAULT_DAT_JAR_PATH });
  return {
    checkDependencies: checkDependencies(settings),
    anonymize: require('./dat-wrapper')(settings).anonymize,
  }
}
