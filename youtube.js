import {child_process, fs, getPath} from "./node.js";
import {clearPlaylist, nextCase, pushPlaylist} from "./playlist.js";
import {startLooper} from "./canvas.js";
import {checkPlayIconSrc} from "./ui.js";

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
        child_process.execSync("\"Youtube API.exe\" https://www.youtube.com/v=" + params.get("v") + " " + getPath("userData"));
        if (status !== undefined) {
            status.innerHTML = "Play video...";
        }
        clearPlaylist();
        pushPlaylist([
            getPath("userData") + "\\00.mp3"
        ]);
        nextCase();
        startLooper(true);
        checkPlayIconSrc();
    },200)

}
