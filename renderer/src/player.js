"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var ytdl = require("ytdl-core");
var stream_1 = require("stream");
var fs = require("fs");
var electron_1 = require("electron");
var path = require("path");
var app = electron_1.remote.app;
var Player = (function () {
    function Player() {
        var _this = this;
        this.information = "";
        this.volume = 0.5;
        this.playIndex = 0;
        this.playlist = [];
        this.player = new Audio();
        this.eventList = {};
        this.loop = false;
        this.player.volume = this.volume;
        this.player.addEventListener("timeupdate", function () {
            _this.emit("timeChange");
        });
        this.player.addEventListener("pause", function () {
            _this.emit("stop");
        });
        this.player.addEventListener("play", function () {
            _this.emit("play");
        });
        this.player.addEventListener("ended", function () {
            if (_this.playIndex < _this.playlist.length) {
                _this.playIndex++;
                _this.load(true);
            }
            else if (_this.loop) {
                _this.playIndex = 0;
                _this.load(true);
            }
            _this.emit("end");
        });
    }
    Player.prototype.playIndexUp = function () {
        if (this.playIndex < this.playlist.length) {
            this.playIndex++;
        }
        else {
            this.playIndex = 0;
        }
        this.load(true);
    };
    Player.prototype.playIndexDown = function () {
        if (this.playIndex === 0) {
            this.playIndex = this.playlist.length - 1;
        }
        else {
            this.playIndex--;
        }
        this.load(true);
    };
    Player.prototype.pushPlaylist = function (item) {
        this.playlist.push(item);
    };
    Player.prototype.setPlaylist = function (items) {
        this.playlist = items;
    };
    Player.prototype.play = function () {
        this.load(true);
    };
    Player.prototype.resume = function () {
        this.player.play();
    };
    Player.prototype.pause = function () {
        this.player.pause();
    };
    Player.prototype.isPlaying = function () {
        return !this.player.paused;
    };
    Player.prototype.setIndex = function (index) {
        this.playIndex = index;
    };
    Player.prototype.setVolume = function (volume) {
        this.volume = volume;
        this.player.volume = volume;
    };
    Player.prototype.getVolume = function () {
        return this.volume;
    };
    Player.prototype.on = function (event, callback) {
        if (!this.eventList[event]) {
            this.eventList[event] = [];
        }
        this.eventList[event].push(callback);
    };
    Player.prototype.getTimeData = function (type) {
        var time = 0;
        switch (type) {
            case "current":
                time = this.player.duration;
                break;
            case "duration":
                time = this.player.currentTime;
                break;
        }
        var sec = Math.round(time);
        var min = Math.floor(sec / 60);
        min = (min < 10) ? "0" + min : min;
        if (typeof min === "number") {
            min = (isNaN(min)) ? "00" : min;
        }
        sec = sec % 60;
        sec = (sec < 10) ? "0" + sec : sec;
        if (typeof sec === "number") {
            sec = (isNaN(sec)) ? "00" : sec;
        }
        return min + ":" + sec;
    };
    Player.prototype.getBarData = function () {
        return this.player.currentTime / this.player.duration * 100;
    };
    Player.prototype.getPlaylist = function () {
        return this.playlist;
    };
    Player.prototype.getPlayIndex = function () {
        return this.playIndex;
    };
    Player.prototype.getLastInformation = function () {
        return this.information;
    };
    Player.prototype.unLoad = function () {
        this.player.src = "";
        this.player.load();
        this.player.pause();
        this.emit("timeChange");
    };
    Player.prototype.getFrequencyBuffer = function () {
        var context = new AudioContext();
        var analyser = context.createAnalyser();
        var source = context.createMediaElementSource(this.player);
        source.connect(analyser);
        analyser.connect(context.destination);
        return new Uint8Array(analyser.frequencyBinCount);
    };
    Player.prototype.isUrl = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(str);
    };
    Player.prototype.clearInformation = function () {
        var _this = this;
        setTimeout(function () {
            _this.information = "";
            _this.emit("information");
        }, 2 * 1000);
    };
    Player.prototype.emit = function (event) {
        for (var i = 0; i < this.eventList[event].length; i++) {
            this.eventList[event][i]();
        }
    };
    Player.prototype.load = function (play) {
        var _this = this;
        this.player.pause();
        if (this.isUrl(this.playlist[this.playIndex])) {
            this.information = "Download Music";
            this.emit("information");
            this.loadYoutubeVideo(function () {
                _this.clearInformation();
                _this.player.src = path.join(app.getPath("temp"), "ap2.tmp") + "?d" + Date.now().toString();
                _this.player.load();
                if (play) {
                    _this.player.play();
                }
            });
            return;
        }
        else {
            this.player.src = this.playlist[this.playIndex];
        }
        this.player.load();
        if (play) {
            this.player.play();
        }
    };
    Player.prototype.loadYoutubeVideo = function (callback) {
        var stream = new stream_1.Transform();
        var file = "";
        stream._transform = function (chunk, encoding, done) {
            this.push(chunk);
            done();
        };
        stream.on("data", function (chunk) {
            file += chunk.toString("latin1");
        });
        stream.on("end", function () {
            fs.writeFileSync(path.join(app.getPath("temp"), "ap2.tmp"), file, {
                encoding: "latin1"
            });
            callback();
        });
        ytdl(this.playlist[this.playIndex], {
            filter: "audioonly",
            quality: "highestaudio",
        }).pipe(stream);
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map