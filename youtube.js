import {fs, getPath} from "./node.js";
import {clearPlaylist, nextCase, pushPlaylist} from "./playlist.js";
import {startLooper} from "./canvas.js";
import {checkPlayIconSrc} from "./ui.js";
import {checkOfflineData, destroyCurrentAnalyse, getDefaultMusicPath, isPlaying, pause} from "./music.js";

let lastURL = "";

export function clearYoutubePlayCache(destroyAnalyse = true) {
    if (destroyAnalyse) {
        destroyCurrentAnalyse();
    }
    if (fs.existsSync(getPath("userData") + "\\00.mp3") && fs.statSync(getPath("userData") + "\\00.mp3")) {
        try {
            fs.unlinkSync(getPath("userData") + "\\00.mp3");
        } catch (err) {
            console.log(err);
        }
    }
}

export function getYTVideo(uri, status = undefined) {
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

    lastURL = uri;
    setTimeout(() => {
        const ytdl = require("ytdl-core");
        ytdl(uri, {filter: "audioonly"}).pipe(fs.createWriteStream(getPath("userData") + "\\00.mp3").on("close",() => {
            clearPlaylist();
            checkOfflineData();
            pushPlaylist([
                getPath("userData") + "\\00.mp3"
            ]);
            nextCase();
            startLooper(true);
            checkPlayIconSrc();
        }));
    },200);
}
