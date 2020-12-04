import {child_process, fs, getPath} from "./node.js";
import {clearPlaylist, nextCase, pushPlaylist} from "./playlist.js";
import {startLooper} from "./canvas.js";
import {checkPlayIconSrc} from "./ui.js";
import {checkOfflineData} from "./music.js";

export function clearYoutubePlayCache() {
    if (fs.existsSync(getPath("userData") + "\\00.mp3") && fs.statSync(getPath("userData") + "\\00.mp3")) {
        fs.unlinkSync(getPath("userData") + "\\00.mp3");
    }
}

export function getYTVideo(uri, status = undefined) {
    clearYoutubePlayCache();
    if (status !== undefined) {
        status.innerHTML = "Get YouTube video...";
    }
    const params = (new URL(uri)).searchParams;
    setTimeout(() => {
        let push = "";
        try {
            child_process.execSync("\"" + __dirname + "\\Youtube API.exe\" https://www.youtube.com/watch?v=" + params.get("v") + " " + getPath("userData"));
            push = "\\00.mp3";
        } catch (err) {
            console.log(err);
            checkOfflineData();
            push = "default.mp3";
        }

        if (status !== undefined) {
            status.innerHTML = "Play video...";
        }
        clearPlaylist();
        pushPlaylist([
            getPath("userData") + push
        ]);
        nextCase();
        startLooper(true);
        checkPlayIconSrc();
    }, 200)

}
