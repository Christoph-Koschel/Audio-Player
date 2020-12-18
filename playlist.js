import {path} from "./node.js";
import {setMusicTitle} from "./ui.js";

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
    if (random) {
        shufflePlaylist();
    }

    if (currentCase === playlist.length - 1) {
        currentCase = 0;
    } else {
        currentCase++;
    }
    setMusicTitle(getMusicName(getCurrentPlaylistPath()));
}

export function lastCase() {
    if (currentCase === 0) {
        currentCase = playlist.length - 1;
    } else {
        currentCase--;
    }
    setMusicTitle(getMusicName(getCurrentPlaylistPath()));
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

export function getPlaylistArray() {
    return playlist;
}

export function isLastCase() {
    return (currentCase === playlist.length - 1);
}

export function setRandomMusic(set) {
    random = set;
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

export function playlistItemHigher(listID) {
    console.log(playlist);
    let copy = playlist[listID + 1];
    playlist[listID + 1] = playlist[listID];
    playlist[listID] = copy;
    console.log(playlist);
}

export function playlistItemLower(listID) {
    console.log(playlist);
    let copy = playlist[listID - 1];
    playlist[listID - 1] = playlist[listID];
    playlist[listID] = copy;
    console.log(playlist);
}

function getMusicName(filePath) {
    let name = path.basename(filePath);
    return name.substr(0, name.lastIndexOf("."));
}

function shufflePlaylist() {
    for (let i = playlist.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        let temp = playlist[i];
        playlist[i] = playlist[j];
        playlist[j] = temp;
    }
}
