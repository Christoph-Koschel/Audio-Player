import {fs, getPath, updateYTList} from "./node.js";
import {clearPlaylist, nextCase, pushPlaylist} from "./playlist.js";
import {startLooper} from "./canvas.js";
import {checkPlayIconSrc} from "./ui.js";
import {checkOfflineData, destroyCurrentAnalyse, getDefaultMusicPath, isPlaying, pause} from "./music.js";

let filename;
let filenameCache = [];

export function clearYoutubePlayCache(destroyAnalyse = true) {
    if (destroyAnalyse) {
        destroyCurrentAnalyse();
    }
    for (let i = 0; i < filenameCache.length; i++) {
        let name = filenameCache[i];
        if (fs.existsSync(getPath("userData") + "\\"+name+".mp3") && fs.statSync(getPath("userData") + "\\"+name+".mp3")) {
            try {
                fs.unlinkSync(getPath("userData") + "\\"+name+".mp3");
                delete filenameCache[i];
            } catch (err) {
                console.log(err);
            }
        }
    }

}

export function getYTVideo(uri, status = undefined) {
    document.forms["loadURLForm"]["url"].value = "";

    if (isPlaying()) {
        pause();
    }
    clearPlaylist();
    checkOfflineData();
    pushPlaylist([
        getDefaultMusicPath()
    ]);
    nextCase();
    startLooper(false);
    checkPlayIconSrc();
    clearYoutubePlayCache();

    if (status !== undefined) {
        status.innerHTML = "Get youtube video...";
    }
    setTimeout(() => {
        const ytdl = require("ytdl-core");
        filename = Date.now();
        filenameCache.push(filename);
        updateYTList(filenameCache);
        ytdl(uri, {filter: "audioonly"}).pipe(fs.createWriteStream(getPath("userData") +"\\"+filename+".mp3").on("close",() => {
            setTimeout(() => {
                if (status !== undefined) {
                    status.innerHTML = "Play";
                }
                clearPlaylist();
                checkOfflineData();
                pushPlaylist([
                    getPath("userData") + "\\"+filename+".mp3"
                ]);
                nextCase();
                startLooper(true);
                checkPlayIconSrc();

                setTimeout(() => {
                    if (status !== undefined) {
                        status.innerHTML = "&nbsp;";
                    }
                },5000);
            },200);
        }));
    },200);
}
