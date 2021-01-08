import {fs, getPath, updateYTList} from "./node.js";
import {clearPlaylist, getPlaylistArray, nextCase, pushPlaylist} from "./playlist.js";
import {resumeLooper, startLooper, stopLooper} from "./canvas.js";
import {checkPlayIconSrc} from "./ui.js";
import {destroyCurrentAnalyse, getDefaultMusicPath} from "./music.js";

let filename;
let filenameCache = [];

export function clearYoutubePlayCache(destroyAnalyse = true) {
    if (destroyAnalyse) {
        destroyCurrentAnalyse();
    }
    for (let i = 0; i < filenameCache.length; i++) {
        let name = filenameCache[i];
        if (fs.existsSync(getPath("userData") + "\\" + name + ".mp3") && fs.statSync(getPath("userData") + "\\" + name + ".mp3")) {
            try {
                fs.unlinkSync(getPath("userData") + "\\" + name + ".mp3");
                delete filenameCache[i];
            } catch (err) {
                console.log(err);
            }
        }
    }

}

export function getYTVideo(uri, status = undefined) {
    document.forms["loadURLForm"]["url"].value = "";

    if (status !== undefined) {
        status.innerHTML = "Get youtube video...";
    }
    setTimeout(() => {
        const ytdl = require("ytdl-core");
        filename = Date.now();
        filenameCache.push(filename);
        updateYTList(filenameCache);
        ytdl(uri, {filter: "audioonly"}).pipe(fs.createWriteStream(getPath("userData") + "\\" + filename + ".mp3").on("close", () => {
            setTimeout(() => {
                let first = false;
                if (status !== undefined) {
                    status.innerHTML = "Completed";
                }
                if (getPlaylistArray().length === 1) {
                    if (getPlaylistArray()[0] === getDefaultMusicPath()) {
                        first = true;
                        clearPlaylist();
                    }
                }
                stopLooper();
                pushPlaylist([
                    getPath("userData") + "\\" + filename + ".mp3"
                ]);

                if (first) {
                    nextCase();
                    startLooper(true);
                } else {
                    resumeLooper(true);
                }
                checkPlayIconSrc();

                setTimeout(() => {
                    if (status !== undefined) {
                        status.innerHTML = "&nbsp;";
                    }
                }, 5000);
            }, 200);
        }));
    }, 200);
}
