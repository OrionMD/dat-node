const datNode = require('../')();
const path = require('path');

datNode.checkDependencies({ verbose: true, jarPath: 'not-valid' }).then(d => console.log(d));

datNode.anonymize(
  {
    verbose: true,
    args: [
      '-in',
      path.join(__dirname, 'dicom/test input'),
      '-out',
      path.join(__dirname, 'dicom/output'),
      '-v',
    ],
  },
  (err, stdout, stderr) => {
    console.log('ERR:', err);
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
  },
);
