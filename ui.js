import {isPlaying} from "./music.js";
import {isFullscreen} from "./node.js";
import {getRepeatMode} from "./playlist.js";

let musicRestTimeMode = false;

export function fadeIn() {
    const ele = document.getElementsByClassName("controller")[0];
    ele.style.opacity = "0";
    const interval = setInterval(() => {
        let opacity = ele.style.opacity;
        opacity = parseFloat(opacity);
        opacity = opacity += 0.2;
        if (opacity >= 1) {
            clearInterval(interval);
            ele.style.opacity = "1";
        } else {
            ele.style.opacity = opacity.toString();
        }
    }, 50);
}

export function fadeOut() {
    const ele = document.getElementsByClassName("controller")[0];
    ele.style.opacity = "1";
    const interval = setInterval(() => {
        let opacity = ele.style.opacity;
        opacity = parseFloat(opacity);
        opacity = opacity -= 0.2;
        if (opacity <= 0) {
            clearInterval(interval);
            ele.style.opacity = "0";
        } else {
            ele.style.opacity = opacity.toString();
        }
    }, 50);
}

export function isMusicRestTimeMode() {
    return musicRestTimeMode;
}

export function setProgressbar(to) {
    document.getElementById("fill").style.width = to.toString() + "%";
}

export function setMusicTime(now, end) {
    document.getElementById("musicTime").innerHTML = now.toString() + "&nbsp;/&nbsp;" + end.toString();
}

export function setMusicRestTime(set) {
    document.getElementById("musicTime").innerHTML = set;
}

export function checkPlayIconSrc() {
    let ele  = document.getElementById("musicControlPlay");
    if (isPlaying()) {
        ele.src = "./res/icon/pause.svg";
    } else {
        ele.src = "./res/icon/play.svg";
    }
}

export function checkScreenIcon() {
    let ele = document.getElementById("screenControl");
    if (isFullscreen()) {
        ele.src = "./res/icon/compress.svg";
    } else {
        ele.src = "./res/icon/expand.svg";
    }
}

export function checkRepeatMode() {
    let ele = document.getElementById("playlistControl");
    ele.classList.remove("notUse");
    switch (getRepeatMode()) {
        case 0:
            ele.src = "./res/icon/repeat.svg";
            ele.classList.add("notUse");
            break;
        case 1:
            ele.src = "./res/icon/repeat.svg";
            break;
        case 2:
            ele.src = "./res/icon/repeat-1.svg";
            break;
    }
}

window.addEventListener("load", () => {
    document.getElementsByClassName("toggleShow")[0].addEventListener("mouseover", () => {
        let img = document.getElementById("toggleShowIcon");
        img.classList.add("light");
    });

    document.getElementsByClassName("toggleShow")[0].addEventListener("mouseleave", () => {
        let img = document.getElementById("toggleShowIcon");
        img.classList.remove("light");
    });

    document.getElementById("musicTime").addEventListener("click", () => {
        musicRestTimeMode = !musicRestTimeMode;
    });
});
