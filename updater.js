import {getVersion} from "./global.js";
import {fs, getPath} from "./node.js";

const {ipcRenderer} = require("electron");

ipcRenderer.send("appVersion");
ipcRenderer.on("appVersion", (event, args) => {
    getVersion(args);
});

ipcRenderer.on('update_available', () => {
    document.getElementById('message').innerText = 'A new update is available.<br>Downloading now...';
    document.getElementById('notification').classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    document.getElementById('message').innerText = 'Update Downloaded.<br>It will be installed on restart. Restart now?';
    document.getElementById('restart-button').classList.remove('hidden');
    document.getElementById('notification').classList.remove('hidden');
});

window.addEventListener("load", () => {
    if (fs.existsSync(getPath("userData") + "\\updated")) {
        document.getElementById("disclaimer").style.display = "unset";
    }

    document.getElementById("close-button").addEventListener("click", () => {
        document.getElementById('notification').classList.add('hidden');
    });

    document.getElementById("restart-button").addEventListener("click", () => {
        ipcRenderer.send('restart_app');
    });

    ipcRenderer.send("check_update");
});
