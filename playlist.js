let playlist = [];
let currentCase = -1;
let repeat = false;
let repeatOne = false;
let noRepeat = true;
let random = false;


export function clearPlaylist() {
    currentCase = -1;
    playlist = [];
}

export function nextCase() {
    if (currentCase === playlist.length -1) {
        currentCase = 0;
    } else {
        currentCase++;
    }
}

export function lastCase() {
    if (currentCase === 0) {
        currentCase = playlist.length -1;
    } else {
        currentCase--;
    }
}

export function getCurrentPlaylistPath() {
    return playlist[currentCase];
}

export function pushPlaylist(array) {
    for (let i = 0; i < array.length; i++) {
        playlist.push(array[i]);
    }
}

export function isRandom() {

}

export function getRepeateMode() {

}

export function changeMode() {
    if (noRepeat) {
        noRepeat = false;
        repeatOne = false;
        repeat = true;
    } else if (repeat) {
        noRepeat = false;
        repeatOne = true;
        repeat = false;
    } else if (repeatOne) {
        noRepeat = true;
        repeatOne = false;
        repeat = false;
    }
}

