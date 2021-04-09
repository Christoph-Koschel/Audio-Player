import {BrowserWindow, app} from "electron";
import * as path from "path";
import {autoUpdater} from "electron-updater";
import * as fs from "fs";

app.on("ready",() => {
    autoUpdater.checkForUpdatesAndNotify();

    const win: BrowserWindow = new BrowserWindow({
        title: "Sirent",
        frame: false, // TODO Change this to false
        icon: path.join(__dirname, "res", "icon", "icon.png"),
        minWidth: 1100,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.setMenu(null);
    win.loadFile(path.join(__dirname, "renderer", "index.html"),{
        search: "path=" + process.argv[1] || ""
    }).then(() => {
        win.webContents.openDevTools({
            mode: "undocked"
        });
    });

    win.on("closed", () => {
        fs.unlinkSync(path.join(app.getPath("temp"), "ap2.tmp"));
        app.quit();
    });
});
