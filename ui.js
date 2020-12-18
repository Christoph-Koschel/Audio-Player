import {isPlaying} from "./music.js";
import {isFullscreen, path} from "./node.js";
import {getPlaylistArray, getRepeatMode, playlistItemHigher, playlistItemLower} from "./playlist.js";
import {getActivePlayMode, getPlayModeList} from "./mode.js";
import {hasClass, rand} from "./global.js";

let musicRestTimeMode = false;
let hiddenTitle = false;

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

export function setMusicTitle(set) {
    if (hiddenTitle) {
        let title = rand(0, 9).toString();
        title += rand(0, 9).toString();
        title += rand(0, 9).toString();
        title += rand(0, 9).toString();
        title += rand(0, 9).toString();
        document.getElementById("musicTitle").innerHTML = title;
        document.getElementById("musicTitle").title = title;
        document.title = "Audio Player 2 - " + title;
    } else {
        document.getElementById("musicTitle").innerHTML = set;
        document.getElementById("musicTitle").title = set;
        document.title = "Audio Player 2 - " + set;
    }

}

export function setHiddenTitle(bool) {
    hiddenTitle = bool;
}

export function checkPlayIconSrc() {
    let ele = document.getElementById("musicControlPlay");
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

export function checkActiveModeBTN() {
    let list = getPlayModeList();

    for (let i = 0; i < list.length; i++) {
        document.getElementById(list[i]).classList.remove("active");
    }

    document.getElementById(getActivePlayMode()).classList.add("active");
}

export function changeUi(to) {
    if (to === "youtube") {
        document.getElementById("openFileControl").style.display = "none";
        document.getElementsByClassName("loopControl")[0].style.display = "none";
        document.getElementsByClassName("loadURL")[0].style.display = "unset";
    } else if (to === "default") {
        document.getElementById("openFileControl").style.display = "unset";
        document.getElementsByClassName("loopControl")[0].style.display = "unset";
        document.getElementsByClassName("loadURL")[0].style.display = "none";
    }
}

export function togglePlaylistView(show) {
    if (show) {
        document.getElementsByClassName("playlistView")[0].style.display = "unset";
    } else {
        document.getElementsByClassName("playlistView")[0].style.display = "none";
    }
}

export function loadPlaylistViewEntries() {
    let list = getPlaylistArray();

    document.getElementById("playlistViewList").innerHTML = "";

    for (let i = 0; i < list.length; i++) {
        let listItem = list[i];

        let box = document.createElement("div");

        let div = document.createElement("div");
        div.classList.add("playlistItemTitle");
        div.title = path.basename(listItem);
        div.innerHTML = path.basename(listItem);

        let control = document.createElement("div");

        let img1 = document.createElement("img");
        img1.src = "./res/icon/arrow-circle-left.svg";
        if (i === 0) {
            img1.classList.add("deactivate");
        }
        img1.addEventListener("click", function () {
            this.itemID = i;

            if (!hasClass(this,"deactivate")) {
                playlistItemLower(this.itemID);
                loadPlaylistViewEntries();
            }
        });

        let img2 = document.createElement("img");
        img2.src = "./res/icon/arrow-circle-right.svg";
        if (i === list.length - 1) {
            img2.classList.add("deactivate");
        }
        img2.addEventListener("click", function () {
            this.itemID = i;

            if (!hasClass(this,"deactivate")) {
                playlistItemHigher(this.itemID);
                loadPlaylistViewEntries();
            }
        });

        control.appendChild(img1);
        control.appendChild(img2);

        box.appendChild(div);
        box.appendChild(control);

        document.getElementById("playlistViewList").appendChild(box);
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
