var olin = require('..');

if (process.argv.length < 5) {
  console.log('Usage: node expanddl.js username password list');
  process.exit(1);
}

olin.expandDistributionList(process.argv[2], process.argv[3], process.argv[4], function (err, ret) {
  console.log(err, ret);
})