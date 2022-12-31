const { app, BrowserWindow, } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const runCommand = async (command) => {
  try{
    const { stdout, stderr } = await exec(command);
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  } catch (e) {
    console.error(e);
  }
}

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev,
    }
  });
  
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  const composeFile = isDev
    ? 'docker-compose.yml'
    : 'docker-compose-prod.yml';

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow.destroy();
    runCommand(`docker compose -f ${composeFile} down`)
      .then(() => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
        process.exit()
      });
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    mainWindow.loadURL(url);
  });
};


app.whenReady().then(() => {
  runCommand(`docker compose -f ${composeFile} up`);

  createMainWindow();
  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});
