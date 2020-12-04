import {destroyCurrentAnalyse} from "./music.js";
import {clearYoutubePlayCache} from "./youtube.js";
import {clearPlaylist} from "./playlist.js";
import {changeUi, checkPlayIconSrc} from "./ui.js";

let activeMode = "";
let modeList = [
    "modeDefault",
    "modeYT"
];

export function changePlayMode(to) {
    if (activeMode === to) {
        return;
    }

    destroyCurrentAnalyse();

    setTimeout(() => {
        clearYoutubePlayCache();
    },500);

    switch (to) {
        case "modeYT":
            changeUi("youtube");
            clearPlaylist();
            activeMode = to;
            break;
        case "modeDefault":
            changeUi("default");
            clearPlaylist();
            activeMode = to;
            break;
    }

    checkPlayIconSrc();
}

export function getActivePlayMode() {
    return activeMode;
}

export function getPlayModeList() {
    return modeList;
}
