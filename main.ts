import {BrowserWindow, app, globalShortcut} from "electron";
import * as path from "path";
import {autoUpdater} from "electron-updater";
import * as fs from "fs";

const mime = require("mime");

app.on("ready",() => {
    autoUpdater.on("update-downloaded", () => {
        autoUpdater.quitAndInstall();
    })

    autoUpdater.checkForUpdates();

    const win: BrowserWindow = new BrowserWindow({
        title: "Sirent",
        frame: false,
        icon: path.join(__dirname, "res", "icon", "icon.png"),
        minWidth: 1100,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    let args: string[] = [];
    for (let i = 0; i < process.argv.length; i++) {
        let mimeType: string = mime.getType(process.argv[i]);
        if (mimeType === "audio/mpeg" || mimeType === "audio/wave") {
            args.push(process.argv[i]);
        }
    }

    win.setMenu(null);
    win.loadFile(path.join(__dirname, "renderer", "index.html"),{
        search: "path=" + JSON.stringify(args)
    }).then(() => {
        if (process.argv.indexOf("dev") != -1) {
            win.webContents.openDevTools({
                mode: "undocked"
            });
        }
    });

    win.on("closed", () => {
        if (fs.existsSync(path.join(app.getPath("temp"), "ap2.tmp"))) {
            fs.unlinkSync(path.join(app.getPath("temp"), "ap2.tmp"));
        }
        app.quit();
    });
});
