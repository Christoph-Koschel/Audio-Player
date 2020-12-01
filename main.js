const {ipcMain, app, BrowserWindow, dialog} = require("electron");
const {autoUpdater} = require("electron-updater");

app.on("ready", () => {
    let WIN = new BrowserWindow({
        width: 1020,
        height: 500,
        minWidth: 1020,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });

    WIN.on("close", () => {
        app.quit();
    });

    WIN.setMenu(null);
    WIN.webContents.openDevTools();

    if (process[0] !== undefined && process[0] !== null) {
        WIN.loadFile("index.html", {
            query: [process[0]]
        });
    } else {
        WIN.loadFile("index.html");
    }

    ipcMain.on("isFullscreen", (event) => {
        event.returnValue = WIN.isFullScreen();
    });

    ipcMain.handle("setFullscreen", (event, args) => {
        WIN.setFullScreen(args);
    });

    ipcMain.on("openFile", (event) => {
        let path = dialog.showOpenDialogSync(WIN, {
            properties: ["openFile", "multiSelections"],
            filters: [
                {
                    name: "Music Files",
                    extensions: ["mp3", "wav"]
                },
                {
                    name: "All Files",
                    extensions: ["*"]
                }
            ]
        });
        if (!path) {
            path = [
                "C:\\Users\\Christoph\\Desktop\\Musik\\Stonebank - Who's Got Your Love _Monstercat Release_.mp3" // TODO edit this with offline song;
            ];
        }
        event.sender.send("openFile", JSON.stringify(path))
    });

    /*
    * ===================================
    * == App Updater
    * ===================================
    */
    //region

    WIN.once("ready-to-show", () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on('update-available', () => {
        WIN.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        WIN.webContents.send('update_downloaded');
    });

    ipcMain.on("appVersion", (event) => {
        event.sender.send("appVersion", app.getVersion());
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

    //endregion
});


