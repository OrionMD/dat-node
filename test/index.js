var datNode = require('../');

datNode.checkDependencies({ verbose: true, jarPath: 'not-valid' }).then(d => console.log(d));
