const { app, BrowserWindow } = require('electron') // eslint-disable-line import/no-extraneous-dependencies
const { chunksToLinesAsync } = require('@rauschma/stringio')

const isDev = require('electron-is-dev')
const execa = require('execa')
const onExit = require('signal-exit')

const path = require('path')
const url = require('url')

require('electron-debug')({
  showDevTools: true,
  enable: true,
})

async function startDevServer(win) {
  const cp = execa('yarn', ['webpack-dev-server', '--mode', 'development'], {
    stdio: ['ignore', 'pipe', 'inherit'],
  })

  onExit((_, sig) => cp && cp.kill(sig))

  for await (const line of chunksToLinesAsync(cp.stdout)) {
    process.stdout.write(line)
    if (line.includes('Project is running')) {
      win.loadURL(`http://localhost:${8000}`)
      win.toggleDevTools()
    }
  }
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let server
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 992,
    height: 700,
    webPreferences: {
      webSecurity: false,
    },
  })

  win.on('closed', () => {
    win = null
  })

  if (isDev) return startDevServer(win)

  win.loadURL(
    url.format({
      pathname: path.resolve(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  )
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }

  if (server) server.close()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
