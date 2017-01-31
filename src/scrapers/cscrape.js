// usage: casperjs src/scrapers/cscrape.js
const casper = require("casper").create();
const fs = require("fs");

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
const captureFile = outputPath + '/captcha.png';
const captchaResultFile = outputPath + "/captcha.txt";
const resultsFile = outputPath + "/results.json";
var timer = 45;
var captchaText = null;

console.log("url: ", url);
console.log("outputPath: ", outputPath);
console.log("captchaResultFile: ", captchaResultFile);

casper.start(url, function() {
  const title = this.getTitle();
  console.log("title is: ", title);
});

casper.then(function () {
  casper.capture(captureFile);
  console.log("captured file at: ", captureFile);
});

// wait for the captcha file before moving to the next step
casper.then(function () {
  readCaptchaText();
});

casper.then(function () {
  console.log("captcha is : ", captchaText);
});

casper.then(function () {
  const title = this.getTitle();
  const resultObj = {
    captchaText: captchaText,
    title: title
  };
  fs.write(resultsFile, JSON.stringify(resultObj, null, 2), 'w');
});

casper.run();

function readCaptchaText() {
  // avoiding setTimeout by using casper steps to wait for the file,
  // setTimeout will allow the execution to the next casper step
  casper.wait(2000);
  casper.then(function () {
    timer--;

    if(timer){
      var status = fs.exists(captchaResultFile);
      if(status){
        captchaText = fs.read(captchaResultFile);
        fs.remove(captchaResultFile);
      } else {
        casper.echo("Waiting for the captcha result File, the script will exit in "+ timer*2 + " secs", "INFO");
        readCaptchaText();
      }
    } else {
      casper.echo("Captcha result file not found", "INFO");
    }
  });
}
