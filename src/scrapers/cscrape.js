// usage: casperjs src/scrapers/cscrape.js
const casper = require("casper").create();

if(!casper.cli.has('url')) {
  casper.echo("Params missing for url. Usage: capserjs cscrape.js --url=https://www.google.co.in --outputPath=<some-path>", "ERROR");
  casper.exit(1);
}

if(!casper.cli.has('outputPath')) {
  casper.echo("Params missing for outputPath. Usage: capserjs cscrape.js --url=https://www.google.co.in --outputPath=<some-path>", "ERROR");
  casper.exit(1);
}

var url = casper.cli.get('url');
var outputPath = casper.cli.get('outputPath');
console.log("url: ", url);
console.log("outputPath: ", outputPath);

casper.start(url, function() {
  const title = this.getTitle();
  console.log("title is: ", title);
});

casper.then(function () {
  const captureFile = outputPath + '/example.png';
  casper.capture(captureFile);
  console.log("captured file at: ", captureFile);
});

casper.run();
