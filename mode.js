import {destroyCurrentAnalyse, isPlaying, pause} from "./music.js";
import {stopLooper} from "./canvas.js";
import {clearYoutubePlayCache} from "./youtube.js";
import {clearPlaylist} from "./playlist.js";
import {changeUi} from "./ui.js";

let activeMode = "";
let modeList = [
    "modeDefault",
    "modeYT"
];

export function changePlayMode(to) {
    if (activeMode === to) {
        return;
    }

    if (isPlaying()) {
        pause();
    }

    clearYoutubePlayCache();

    switch (to) {
        case "modeYT":
            destroyCurrentAnalyse();
            changeUi("youtube");
            clearPlaylist();

            activeMode = to;
            break;
        case "modeDefault":
            destroyCurrentAnalyse();
            changeUi("default");
            clearPlaylist();
            activeMode = to;
            break;
    }
}

export function getActivePlayMode() {
    return activeMode;
}

export function getPlayModeList() {
    return modeList;
}
