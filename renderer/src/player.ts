import ytdl = require('ytdl-core');
import {Transform} from "stream";
import * as fs from "fs";
import {remote} from "electron";
import * as path from "path";

const app: Electron.App = remote.app

export class Player {
    private playlist: string[];
    private playIndex: number;
    private player: HTMLAudioElement;
    private readonly eventList: any;
    private loop: boolean;
    private information: string = "";
    private volume: number = 0.5;

    constructor() {
        this.playIndex = 0;
        this.playlist = [];
        this.player = new Audio();
        this.eventList = {};
        this.loop = false;

        this.player.volume = this.volume;

        this.player.addEventListener("timeupdate", () => {
            this.emit("timeChange");
        });

        this.player.addEventListener("pause", () => {
            this.emit("stop");
        });

        this.player.addEventListener("play", () => {
            this.emit("play");
        });

        this.player.addEventListener("ended", () => {
            if (this.playIndex < this.playlist.length) {
                this.playIndex++;
                this.load(true);
            } else if (this.loop) {
                this.playIndex = 0;
                this.load(true);
            }
            this.emit("end");
        });
    }

    public playIndexUp(): void {
        if (this.playIndex < this.playlist.length) {
            this.playIndex++;
        } else {
            this.playIndex = 0;
        }

        this.load(true);
    }

    public playIndexDown(): void {
        if (this.playIndex === 0) {
            this.playIndex = this.playlist.length - 1;
        } else {
            this.playIndex--;
        }

        this.load(true);
    }

    public pushPlaylist(item: string): void {
        this.playlist.push(item);
    }

    public setPlaylist(items: string[]): void {
        this.playlist = items;
    }

    public play(): void {
        this.load(true);
    }

    public resume(): void {
        this.player.play();
    }

    public pause(): void {
        this.player.pause();
    }

    public isPlaying(): boolean {
        return !this.player.paused;
    }

    public setIndex(index: number): void {
        this.playIndex = index;
    }

    public setVolume(volume:number) {
        this.volume = volume;
        this.player.volume = volume;
    }

    public getVolume(): number {
        return this.volume;
    }

    public on(event: "play" | "stop" | "timeChange" | "end" | "information", callback: {
        (): void
    }): void {
        if (!this.eventList[event]) {
            this.eventList[event] = [];
        }
        this.eventList[event].push(callback);
    }

    public getTimeData(type: "duration" | "current"): string {
        let time: number = 0;

        switch (type) {
            case "current":
                time = this.player.duration;
                break;
            case "duration":
                time = this.player.currentTime;
                break;
        }

        let sec: number | string = Math.round(time);
        let min: number | string = Math.floor(sec / 60);

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
    }

    public getBarData(): number {
        return this.player.currentTime / this.player.duration * 100
    }

    public getPlaylist(): string[] {
        return this.playlist;
    }

    public getPlayIndex(): number {
        return this.playIndex;
    }

    public getLastInformation(): string {
        return this.information;
    }

    public unLoad(): void {
        this.player.src = "";
        this.player.load();
        this.player.pause();
        this.emit("timeChange");
    }

    private isUrl(str: string): boolean {
        let pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(str);
    }

    private clearInformation(): void {
        setTimeout(() => {
           this.information = "";
           this.emit("information");
        }, 2*1000);
    }

    private emit(event: "play" | "stop" | "timeChange" | "end" | "information"): void {
        for (let i: number = 0; i < this.eventList[event].length; i++) {
            this.eventList[event][i]();
        }
    }

    private load(play: boolean): void {
        this.player.pause();
        if (this.isUrl(this.playlist[this.playIndex])) {
            this.information = "Download Music";
            this.emit("information");
            this.loadYoutubeVideo(() => {
                this.clearInformation();
                this.player.src = path.join(app.getPath("temp"), "ap2.tmp") + "?d" + Date.now().toString();
                this.player.load();
                if (play) {
                    this.player.play();
                }
            });
            return;
        } else {
            this.player.src = this.playlist[this.playIndex];
        }
        this.player.load();
        if (play) {
            this.player.play();
        }
    }

    private loadYoutubeVideo(callback: { (): void }) {
        let stream = new Transform();
        let file: string = "";

        stream._transform = function (chunk, encoding, done) {
            this.push(chunk);
            done();
        }

        stream.on("data", (chunk: Buffer) => {
            file += chunk.toString("latin1");
        });

        stream.on("end", () => {
            fs.writeFileSync(path.join(app.getPath("temp"), "ap2.tmp"), file, {
                encoding: "latin1"
            });

            callback();
        });

        ytdl(this.playlist[this.playIndex], {
            filter: "audioonly",
            quality: "highestaudio",
        }).pipe(stream);
    }
}
