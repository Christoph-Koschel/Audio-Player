import {hasClass, URI, urlParams} from "./global.js";
import {fadeIn, fadeOut, checkScreenIcon, checkPlayIconSrc, checkRepeatMode, checkActiveModeBTN} from "./ui.js";
import {startLooper, stopLooper} from "./canvas.js";
import {checkOfflineData, getDefaultMusicPath, isPlaying, pause, play, timeBackward, timeForward} from "./music.js";
import {fs, getPath, isFullscreen, openFile, setFullscreen} from "./node.js";
import {changeMode, clearPlaylist, isRandom, lastCase, nextCase, pushPlaylist, setRandomMusic} from "./playlist.js";
import {changePlayMode} from "./mode.js";
import {getYTVideo} from "./youtube.js";

function toggleControllerView() {
    let ele = document.getElementsByClassName("toggleShow")[0];
    if (hasClass(ele, "opened")) {
        fadeOut();
        ele.classList.remove("opened");
        document.getElementById("toggleShowIcon").src = "./res/icon/angle-up.svg";
    } else {
        fadeIn();
        ele.classList.add("opened");
        document.getElementById("toggleShowIcon").src = "./res/icon/angle-down.svg";
    }
}

function controlPlay() {
    if (isPlaying()) {
        pause();
    } else {
        play();
    }
    checkPlayIconSrc();
}

function controlNext() {
    if (isPlaying()) {
        pause();
    }
    stopLooper();
    nextCase();
    startLooper(true);
    checkPlayIconSrc();
}

function controlLast() {
    if (isPlaying()) {
        pause();
    }
    stopLooper();
    lastCase();
    startLooper(true);
    checkPlayIconSrc();
}

function toggleFullscreen() {
    if (isFullscreen()) {
        setFullscreen(false);
    } else {
        setFullscreen(true);
    }
}

window.addEventListener("load", () => {
    window.addEventListener("keyup", (event) => {
        console.log(event.keyCode);
        if (event.shiftKey && event.keyCode === 67) { // 67 === "c"
            toggleControllerView();
        } else if (event.keyCode === 32) { // 32 === "(space)"
            controlPlay();
        } else if (event.shiftKey && event.keyCode === 88) { // 88 === "x"
            controlNext();
        } else if (event.shiftKey && event.keyCode === 89) { // 89 === "y"
            controlLast();
        } else if (event.shiftKey && event.keyCode === 70) { // 70 === "f"
            toggleFullscreen();
        }
    });

    document.getElementsByClassName("toggleShow")[0].addEventListener("click", function () {
        toggleControllerView();
    });

    /*
     * ===================================
     * == Music Control
     * ===================================
     */
    //region

    document.getElementById("musicControlPlay").addEventListener("click", () => {
        controlPlay();
    });

    document.getElementById("musicControlNext").addEventListener("click", () => {
        controlNext();
    });

    document.getElementById("musicControlLast").addEventListener("click", () => {
        controlLast();
    });

    document.getElementById("musicBackward").addEventListener("click",() => {
        timeBackward(5);
    });

    document.getElementById("musicForward").addEventListener("click",() => {
        timeForward(5);
    });

    //endregion
    /*
     * ===================================
     * == Bottom right control box
     * ===================================
     */
    //region
    document.getElementById("screenControl").addEventListener("click", () => {
        toggleFullscreen();
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

            getYTVideo(url, document.forms["loadURLForm"]["output"]);
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

    document.getElementById("disclaimerFrame").contentWindow.document.getElementById("sub").addEventListener("click", () => {
        document.getElementById("disclaimer").style.display = "none";
        fs.unlinkSync(getPath("userData") + "\\updated");
    });
});
