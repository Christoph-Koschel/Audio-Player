import {checkPlayIconSrc, isMusicRestTimeMode, setMusicRestTime, setMusicTime, setProgressbar} from "./ui.js";
import {isLastCase, isRepeat, isRepeatOne, nextCase} from "./playlist.js";
import {startLooper, stopLooper} from "./canvas.js";

let audio = new Audio();
let context;
let analyser;
let frequency;

export function analyse(path) {
    audio = new Audio();
    context = new (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    audio.src = path;
    let source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frequency = new Uint8Array(analyser.frequencyBinCount);
    setEvents();
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
