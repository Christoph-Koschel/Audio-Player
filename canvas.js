import {analyse, getFrequency, play} from "./music.js";
import {getCurrentPlaylistPath} from "./playlist.js";

let canvas;
let ctx;
let loop = false;
let gradient;
let sizer = 1.5;
let center = {
    x: 0,
    y: 0
}

export function startLooper(autoplay) {
    let path = getCurrentPlaylistPath();
    analyse(path);
    if (autoplay) {
        play();
    }
    loop = true;
    window.requestAnimationFrame(looper);
}

export function resumeLooper(autoplay) {
    loop = true;
    if (autoplay) {
        play();
    }
    window.requestAnimationFrame(looper);
}

export function stopLooper() {
    loop = false;
}

function looper() {
    draw();
    if (loop) {
        window.requestAnimationFrame(looper);
    }
}

function draw() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    center.x = canvas.width / 2;
    center.y = canvas.height / 2;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    /*
     * ===================================
     * == Background
     * ===================================
     */
    //region
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fill();
    //endregion

    /*
     * ===================================
     * == Other circle
     * ===================================
     */
    //region
    gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 100 + 10 + 255 / sizer);
    gradient.addColorStop(1, "rgb(0,0,0)");
    gradient.addColorStop(0.1, "#ffffff");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    //endregion
    /*
     * ===================================
     * == Inner circle
     * ===================================
     */
    //region
    gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 100 - 5);
    gradient.addColorStop(1, "rgba(163,0,252,0.5)");
    gradient.addColorStop(0.5, "#ffffff");

    ctx.beginPath();
    ctx.fillStyle = gradient
    ctx.arc(center.x, center.y, 100 - 5, 0, Math.PI * 2);
    ctx.fill();
    //endregion
    /*
     * ===================================
     * == Bars
     * ===================================
     */
    //region
    let frequency_array = getFrequency();
    let alpha = 0;
    let x1;
    let x2;
    let y1;
    let y2;

    for (let i = 0; i < 360; i++) {


        x1 = Math.cos(alpha) * 100;
        x2 = Math.cos(alpha) * (100 + frequency_array[i] /sizer);
        y1 = Math.sin(alpha) * 100;
        y2 = Math.sin(alpha) * (100 + frequency_array[i] /sizer);

        x1 += center.x;
        x2 += center.x;
        y1 += center.y;
        y2 += center.y;

        ctx.beginPath();

        let gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0.1, "rgba(163,0,252,0.5)");
        gradient.addColorStop(1, "#ffffff");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        alpha = alpha + 8
    }
    //endregion
}
