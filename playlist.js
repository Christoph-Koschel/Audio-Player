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
    return random;
}

export function isRepeat() {
    return repeat;
}

export function isRepeatOne() {
    return repeatOne;
}

export function getRepeatMode() {
    if (noRepeat) {
        return 0;
    } else if (repeat) {
        return 1;
    } else if (repeatOne) {
        return 2;
    }
}

export function isLastCase() {
    return (currentCase === playlist.length -1);
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

