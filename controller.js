import {hasClass, urlParams} from "./global.js";
import {fadeIn, fadeOut, checkScreenIcon, checkPlayIconSrc, checkRepeatMode} from "./ui.js";
import {startLooper} from "./canvas.js";
import {isPlaying, pause, play} from "./music.js";
import {isFullscreen, openFile, setFullscreen} from "./node.js";
import {changeMode, clearPlaylist, nextCase, pushPlaylist} from "./playlist.js";

window.addEventListener("load", () => {
    document.getElementsByClassName("toggleShow")[0].addEventListener("click", function () {
        if (hasClass(this, "opened")) {
            fadeOut();
            this.classList.remove("opened");
            document.getElementById("toggleShowIcon").src = "./res/icon/angle-up.svg";
        } else {
            fadeIn();
            this.classList.add("opened");
            document.getElementById("toggleShowIcon").src = "./res/icon/angle-down.svg";
        }
    });

    document.getElementById("musicControlPlay").addEventListener("click", () => {
        if (isPlaying()) {
            pause();
        } else {
            play();
        }
        checkPlayIconSrc();
    });

    document.getElementById("screenControl").addEventListener("click", () => {
        if (isFullscreen()) {
            setFullscreen(false);
        } else {
            setFullscreen(true);
        }
    });

    document.getElementById("openFileControl").addEventListener("click", () => {
        openFile();
    });

    document.getElementById("playlistControl").addEventListener("click",() => {
        changeMode();
        checkRepeatMode();
    });

    if (urlParams.has("0")) {
        let path = urlParams.get("0");
        clearPlaylist();
        pushPlaylist([
            path
        ]);
        nextCase();
        startLooper(true);
        checkPlayIconSrc();
        checkScreenIcon();
    } else {
        clearPlaylist();
        pushPlaylist([
            "C:\\Users\\Christoph\\Desktop\\Musik\\Stonebank - Who's Got Your Love _Monstercat Release_.mp3" // TODO edit this with offline song;
        ]);
        nextCase();
        startLooper(false);
        checkPlayIconSrc();
        checkScreenIcon();
    }
});
