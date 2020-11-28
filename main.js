const {ipcMain, app, BrowserWindow} = require("electron");
const {autoUpdater} = require("electron-updater");

app.on("ready", () => {
    let WIN = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });

    WIN.on("close",() => {
       app.quit();
    });

    WIN.loadFile("index.html");
    WIN.once("ready-to-show",() => {
       autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on('update-available', () => {
        WIN.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        WIN.webContents.send('update_downloaded');
    });

    ipcMain.on("appVersion",(event, args) => {
        event.sender.send("appVersion",app.getVersion());
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });
});


