# Embedding a React app in an Electron shell

roughly a webview is kind of `iframe` but for Electron.
it runs in its own render process.

see [docs](https://github.com/electron/electron/blob/master/docs/api/webview-tag.md)
last git SHA was [c75a1f0](https://github.com/electron/electron/commit/c75a1f08fdfa4d67c3ffc3f52e629f6db3466919)

terminology:

- guest: the React app
- embedded page: the Electron app

### Problems with webview

It seems to be the one option for embedding a React app into an Electron app
Not sure how it is different from `loadURL` from the main process

- debugging in painful. because it is a seperate process. need to start two dev-tools.
  - one for the guest process
  - one for the embedded page
- some [gotchas](https://github.com/electron/electron/blob/master/docs/api/webview-tag.md#css-styling-notes) about styling a webview. but it is a plus that it is possible :-)
  - uses flexbox. no other option
  - cannot use `display: none` for hiding the webview. need some flexbox tricks

## Communicating between React and Electron

Exploring two possible ways:

1. IPC
2. http server hosted by Electron and called by React

### IPC

It seems to be the Electron way but it has some disadvantages:

- Need to change the build process for the React app [1]. not a drop in replacement.
  This is because we call `require("electron")` from React. so webpack need to know about Electron and Node,
  otherwise it will treat it like another bundle and barf on it
- Node throws a warning about memory-leaks. but this is more of a coding practice issue. need to be careful though
- the webview needs `nodeintegration` to be enabled. which can be a security problem in some cases.
  can selectively preload though

The advantages are:

- the `electron-way`. even Electron uses it for its communication between the main and renderer process.
  there is a devtron chrome plugin to view/record the communication as well
- two way communication. The React and Electron app can communicate with each other.
  communication can be initiated by React or Electron

### HTTP server

Seems to the simplest to integrate, but it has some disadvantages:

- one way communication. HTTP server is started by Electron and the React app uses it to call Electron
  Electron cannot call into the React app. can inject code into the webview.
  but that is not a HTTP server of-course
- user gets a notification that the Electron app will need to accept network connections
  > Do you want the application “Electron.app” to accept incoming network connections?
- need to enable CORS for the http server running on Electron

The advantages are:

- seems to the simplest to integrate, as we do not need to change the build process for the React app
- the webview does not need `nodeintegration` to be enabled

[1] webpack snippet for React app called from Electron

```json
  /**
   * Set target to Electron specific node.js env.
   * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
   */
  target: 'electron-main',

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  }
```