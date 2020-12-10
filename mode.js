import {destroyCurrentAnalyse} from "./music.js";
import {clearYoutubePlayCache} from "./youtube.js";
import {clearPlaylist} from "./playlist.js";
import {changeUi, checkPlayIconSrc, setHiddenTitle} from "./ui.js";

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
            setHiddenTitle(true);
            activeMode = to;
            break;
        case "modeDefault":
            changeUi("default");
            clearPlaylist();
            setHiddenTitle(false);
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
