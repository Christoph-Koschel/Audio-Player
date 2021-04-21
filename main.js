"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var updater_1 = require("./updater");
var mime = require("mime");
electron_1.app.on("ready", function () {
    updater_1.update(electron_1.app.getPath("temp"));
    var win = new electron_1.BrowserWindow({
        title: "Sirent",
        frame: false,
        icon: path.join(__dirname, "res", "icon", "icon.png"),
        minWidth: 1100,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    var args = [];
    for (var i = 0; i < process.argv.length; i++) {
        var mimeType = mime.getType(process.argv[i]);
        if (mimeType === "audio/mpeg" || mimeType === "audio/wave") {
            args.push(process.argv[i]);
        }
    }
    win.setMenu(null);
    win.loadFile(path.join(__dirname, "renderer", "index.html"), {
        search: "path=" + JSON.stringify(args)
    }).then(function () {
        if (process.argv.indexOf("dev") != -1) {
            win.webContents.openDevTools({
                mode: "undocked"
            });
        }
    });
    win.on("closed", function () {
        if (fs.existsSync(path.join(electron_1.app.getPath("temp"), "ap2.tmp"))) {
            fs.unlinkSync(path.join(electron_1.app.getPath("temp"), "ap2.tmp"));
        }
        electron_1.app.quit();
    });
});
//# sourceMappingURL=main.js.map