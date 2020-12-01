import {checkPlayIconSrc, checkScreenIcon} from "./ui.js";
import {isPlaying, pause} from "./music.js";
import {clearPlaylist, nextCase, pushPlaylist} from "./playlist.js";
import {startLooper, stopLooper} from "./canvas.js";

const {ipcRenderer} = require("electron");

export const fs = require("fs");

export function isFullscreen() {
    return ipcRenderer.sendSync("isFullscreen");
}

export function setFullscreen(boolean) {
    ipcRenderer.invoke("setFullscreen", boolean).then((res) => {
        checkScreenIcon();
    });
}

export function openFile() {
    if (isPlaying()) {
        pause();
    }
    ipcRenderer.on("openFile",(event,args) => {
        clearPlaylist();
        pushPlaylist(JSON.parse(args));
        nextCase();
        stopLooper();
        startLooper(false);
        checkPlayIconSrc();
    });
    ipcRenderer.send("openFile");

}
