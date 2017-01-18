'use strict';

// app: Module to control application life.
// BrowserWindow: Module to create native browser window.
import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

const http = require("http");
const port = 8080;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function onClosed() {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  });

  // can show earlier for debugging
  // mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "../static/index.html"),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    // console.log("===> ready to show"); // DEBUG
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', onClosed);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

http.createServer(function(request, response) {
  // Set CORS headers
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');

	if (request.method === 'OPTIONS' ) {
    response.writeHead(200);
	  response.end();
	} else {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    setTimeout(() => {
      response.end(JSON.stringify({ message: 'test' }));
    }, 2000);
  }
}).listen(port);

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
