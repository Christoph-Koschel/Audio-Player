"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var electron_updater_1 = require("electron-updater");
var fs = require("fs");
electron_1.app.on("ready", function () {
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    var win = new electron_1.BrowserWindow({
        transparent: true,
        title: "Sirent",
        frame: false,
        icon: path.join(__dirname, "res", "icon", "icon.png"),
        minWidth: 1100,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    win.setMenu(null);
    win.loadFile(path.join(__dirname, "renderer", "index.html"), {
        search: "path=" + process.argv[1] || ""
    }).then(function () {
        win.webContents.openDevTools({
            mode: "undocked"
        });
    });
    win.on("closed", function () {
        fs.unlinkSync(path.join(electron_1.app.getPath("temp"), "ap2.tmp"));
        electron_1.app.quit();
    });
});
//# sourceMappingURL=main.js.map