// const datNode = require('../..')({ verbose: true, jarPath: 'not-valid' });
const path = require('path');
const datNode = require('../..')({ verbose: true });

datNode.anonymize(
  {
    verbose: true,
    args: [
      '-in',
      path.join(__dirname, '../dicom/ct with invalid files'),
      '-out',
      path.join(__dirname, '../dicom/output'),
      '-n',
      '4',
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('PARSED:', output.parsed);
    console.log('STDOUT:', output.stdout);
  },
);
