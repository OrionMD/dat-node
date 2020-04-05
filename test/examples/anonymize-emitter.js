// const datNode = require('../..')({ verbose: true, jarPath: 'not-valid' });
const path = require('path');
const datNode = require('../..')({ verbose: true });

const anonymizer = datNode.anonymize({
  verbose: true,
  args: [
    '-in',
    path.join(__dirname, '../dicom/ct with invalid files'),
    '-out',
    path.join(__dirname, '../dicom/output'),
    '-n',
    '4',
  ],
});

anonymizer.on('error', err => console.log('ERR:', err));
anonymizer.on('progress', data => console.log('PROGRESS:', data));
anonymizer.on('done', data => console.log('DONE:', data));
