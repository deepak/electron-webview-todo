'use strict';

import { spawn } from 'child_process';

function scrape(scraperPath) {
  if (process.platform === 'win32') {
    return scrapeOnWindows(scraperPath);
  } else {
    return scrapeOnDarwin(scraperPath);
  }
}

function scrapeOnWindows(scraperPath) {
  // const casperPath = path.join(__dirname, "../casperjs/batchbin/casperjs.bat");
  // const scraperPath = path.join(__dirname, "../scrapers/cscrape.js");
  // const bat = spawn('cmd.exe', ['/c', `${casperPath} ${scraperPath} --url=https://www.google.co.in --outputPath=${outputPath}` ]);

  // bat.stdout.on('data', (data) => {
  //   console.log(data);
  // });

  // bat.stderr.on('data', (data) => {
  //   console.log(data);
  // });

  // bat.on('exit', (code) => {
  //   console.log(`Child exited with code ${code}`);
  // });
  return "windows";
}

function scrapeOnDarwin(scraperPath) {
  return "darwin";
}

module.exports = scrape;
