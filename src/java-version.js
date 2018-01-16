const childProcess = require('child_process');

module.exports = function javaVersion() {
  return new Promise((resolve, reject) => {
    childProcess.exec('java -version', (err, stdout, stderr) => {
      const version = new RegExp('version').test(stderr)
        ? stderr
          .replace('\n', ' ')
          .split(' ')[2]
          .replace(/"/g, '')
        : false;
      if (err) return reject(err);
      return resolve(version);
    });
  });
};
