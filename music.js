import {checkPlayIconSrc, isMusicRestTimeMode, setMusicRestTime, setMusicTime, setProgressbar} from "./ui.js";
import {isLastCase, isRepeat, isRepeatOne, nextCase, pushPlaylist} from "./playlist.js";
import {startLooper, stopLooper} from "./canvas.js";
import {fs, getPath} from "./node.js";

let audio = new Audio();
let context;
let analyser;
let frequency;
let defaultFile = "\\default.mp3";
let volume = 0.5;

export function analyse(path) {
    audio = new Audio();
    context = new (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    audio.src = path;
    audio.volume = volume;
    let source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frequency = new Uint8Array(analyser.frequencyBinCount);
    setEvents();
}

export function destroyCurrentAnalyse() {
    if (isPlaying()) {
        pause();
    }
    audio = new Audio();
    checkOfflineData();
    pushPlaylist([
        getDefaultMusicPath()
    ]);
    nextCase();
    startLooper(false);
}

export function play() {
    if (audio.paused) {
        audio.play();
    }
}

export function pause() {
    if (!audio.paused) {
        audio.pause();
    }
}

export function isPlaying() {
    return (!audio.paused);
}

export function getFrequency() {
    analyser.getByteFrequencyData(frequency);
    return frequency;
}

function setEvents() {
    audio.addEventListener("timeupdate", () => {
        if (isMusicRestTimeMode()) {
            setMusicRestTime(getRestTimeData());
        } else {
            setMusicTime(getTimeData(audio.currentTime), getTimeData(audio.duration));
        }
        setProgressbar(audio.currentTime / audio.duration * 100);
    });
    audio.addEventListener("ended",() => {
        if (isRepeatOne()) {
            play();
        } else if (isLastCase()) {
            if (isRepeat()) {
                nextCase();
                stopLooper();
                startLooper(true);
            }
        } else {
            nextCase();
            stopLooper();
            startLooper(true);
        }

        checkPlayIconSrc();
    });
}

export function checkOfflineData() {
    let path = getPath("userData") + defaultFile;
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path,"");
    }
}

export function getDefaultMusicPath() {
    return getPath("userData") + defaultFile;
}

function getTimeData(time) {
    let sec = Math.round(time);
    let min = Math.floor(sec / 60);

    min = (min < 10) ? "0" + min : min;
    min = (isNaN(min)) ? "00" : min;

    sec = sec % 60;
    sec = (sec < 10) ? "0" + sec : sec;
    sec = (isNaN(sec)) ? "00" : sec;

    return min + ":" + sec;
}

function getRestTimeData() {
    let time1 = audio.duration;
    let time2 = audio.currentTime;
    let restTime;
    restTime = time1 - time2;
    restTime = getTimeData(restTime);
    return "-" + restTime;
}
