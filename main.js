const {ipcMain, app, BrowserWindow, dialog} = require("electron");
const {autoUpdater} = require("electron-updater");
const fs = require("fs");

app.on("ready", () => {
    global["userData"] = app.getPath("userData");

    let WIN = new BrowserWindow({
        width: 1020,
        height: 500,
        minWidth: 1020,
        minHeight: 500,
        icon: __dirname + "\\res\\icon\\icon.ico",
        webPreferences: {
            nodeIntegration: true
        }
    });

    WIN.on("close", () => {
        app.quit();
    });

    WIN.setMenu(null);

    if (process.argv[1] !== undefined && process.argv[1] !== null) {
        WIN.loadFile("index.html", {
            query: [process.argv[1]]
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

    ipcMain.on("userData",(event) => {
        event.returnValue = app.getPath("userData");
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
            let path = app.getPath("userData") + "\\default.mp3";
            if (!fs.existsSync(path) && !fs.statSync(path).isFile()) {
                fs.writeFileSync(path,"");
            }
            path = [
                app.getPath("userData") + "\\default.mp3"
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


