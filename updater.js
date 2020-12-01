import {Version} from "./global.js";

const {ipcRenderer} = require("electron");

ipcRenderer.send("appVersion");
ipcRenderer.on("appVersion", (event, args) => {
    Version(args);
});

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    document.getElementById('message').innerText = 'A new update is available. Downloading now...';
    document.getElementById('notification').classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    document.getElementById('message').innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    document.getElementById('restart-button').classList.remove('hidden');
    document.getElementById('notification').classList.remove('hidden');
});

window.addEventListener("load",() => {
    document.getElementById("close-button").addEventListener("click",() => {
        document.getElementById('notification').classList.add('hidden');
    });

    document.getElementById("restart-button").addEventListener("click",() => {
        ipcRenderer.send('restart_app');
    });
});
