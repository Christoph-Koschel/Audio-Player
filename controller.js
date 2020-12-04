import {hasClass, URI, urlParams} from "./global.js";
import {fadeIn, fadeOut, checkScreenIcon, checkPlayIconSrc, checkRepeatMode, checkActiveModeBTN} from "./ui.js";
import {startLooper, stopLooper} from "./canvas.js";
import {checkOfflineData, getDefaultMusicPath, isPlaying, pause, play} from "./music.js";
import {isFullscreen, openFile, setFullscreen} from "./node.js";
import {changeMode, clearPlaylist, isRandom, lastCase, nextCase, pushPlaylist, setRandomMusic} from "./playlist.js";
import {changePlayMode} from "./mode.js";
import {getYTVideo} from "./youtube.js";

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
    /*
     * ===================================
     * == Music Control
     * ===================================
     */
    //region

    document.getElementById("musicControlPlay").addEventListener("click", () => {
        if (isPlaying()) {
            pause();
        } else {
            play();
        }
        checkPlayIconSrc();
    });

    document.getElementById("musicControlNext").addEventListener("click", () => {
        if (isPlaying()) {
            pause();
        }
        stopLooper();
        nextCase();
        startLooper(true);
        checkPlayIconSrc();
    });

    document.getElementById("musicControlLast").addEventListener("click", () => {
        if (isPlaying()) {
            pause();
        }
        stopLooper();
        lastCase();
        startLooper(true);
        checkPlayIconSrc();
    });
    //endregion
    /*
     * ===================================
     * == Bottom right control box
     * ===================================
     */
    //region
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

    document.getElementById("loadURLForm").addEventListener("submit", (e) => {
        e.preventDefault();
        document.forms["loadURLForm"]["output"].innerHTML = "&nbsp;";
        let url = document.forms["loadURLForm"]["url"].value;
        let domain = URI.getDomain(url);
        if (domain.split(".")[1] === "youtube") {
            if (isPlaying()) {
                pause();
                stopLooper();
            }

            getYTVideo(url,document.forms["loadURLForm"]["output"]);
        } else {
        }
    });
    //endregion
    /*
     * ===================================
     * == Top right Control
     * ===================================
     */
    //region

    document.getElementById("modeDefault").addEventListener("click", () => {
        changePlayMode("modeDefault");
        checkActiveModeBTN();
    });

    document.getElementById("modeYT").addEventListener("click", () => {
        changePlayMode("modeYT");
        checkActiveModeBTN();
    });

    document.getElementById("playlistControl").addEventListener("click", () => {
        changeMode();
        checkRepeatMode();
    });

    document.getElementById("randomControl").addEventListener("click", () => {
        let ele = document.getElementById("randomControl");
        ele.classList.remove("notUse");
        if (isRandom()) {
            setRandomMusic(false);
            ele.classList.add("notUse");
        } else {
            setRandomMusic(true);
        }
    });
    //endregion
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
        checkOfflineData();
        pushPlaylist([
            getDefaultMusicPath()
        ]);
        nextCase();
        startLooper(false);
        checkPlayIconSrc();
        checkScreenIcon();
    }
});
