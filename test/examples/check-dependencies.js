const datNode = require('../..')({ verbose: true });

datNode.checkDependencies((err, output) => {
  console.log('ERR:', err);
  console.log('DEPS:', output);
});
