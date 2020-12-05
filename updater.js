import {getVersion} from "./global.js";

const {ipcRenderer} = require("electron");

ipcRenderer.send("appVersion");
ipcRenderer.on("appVersion", (event, args) => {
    getVersion(args);
});

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    window.addEventListener("load",() => {
        document.getElementById('message').innerText = 'A new update is available. Downloading now...';
        document.getElementById('notification').classList.remove('hidden');
    });
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    window.addEventListener("load",() => {
        document.getElementById('message').innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
        document.getElementById('restart-button').classList.remove('hidden');
        document.getElementById('notification').classList.remove('hidden');
    });
});

ipcRenderer.on("update_installed",() => {
   ipcRenderer.removeAllListeners("update_installed");
   window.addEventListener("load",() => {
       document.getElementById("disclaimer").style.display = "";
   });
});

window.addEventListener("load", () => {
    document.getElementById("close-button").addEventListener("click", () => {
        document.getElementById('notification').classList.add('hidden');
    });

    document.getElementById("restart-button").addEventListener("click", () => {
        ipcRenderer.send('restart_app');
    });
});
