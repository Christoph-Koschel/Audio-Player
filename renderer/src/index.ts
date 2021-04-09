import {ipcRenderer, remote} from "electron";
import * as fs from "fs";
import * as path from "path";
import * as ytpl from "ytpl";
import {Player} from "./player";
import {IPlaylist, Playlist} from "./playlist";

const mime = require("mime");

export namespace Index {
    const app: Electron.App = remote.app;
    const dialog: Electron.Dialog = remote.dialog;
    const player: Player = new Player();
    const playlist: Playlist = new Playlist(path.join(app.getPath("userData"), "playlist"));

    export class Main {
        public constructor() {
            let params: URLSearchParams = new URLSearchParams(window.location.search);
            const view: Views = new Views();
            playlist.build("list", document.getElementsByClassName("playlistList")[0], (playlist) => {
                view.changeView("costumePlaylist");
                document.getElementById("customPlaylist")?.setAttribute("playlistName", playlist.name);
                view.loadCostumePlaylist(playlist);
            });
            console.log(params.get("path"));

            document.getElementById("winClose")?.addEventListener("click", () => {
                remote.getCurrentWindow().close();
            });

            document.getElementById("winMin")?.addEventListener("click", () => {
                remote.getCurrentWindow().minimize();
            });

            document.getElementById("winSize")?.addEventListener("click", () => {
                if (remote.getCurrentWindow().isMaximized()) {
                    remote.getCurrentWindow().unmaximize();
                } else {
                    remote.getCurrentWindow().maximize();
                }
            });

            // @ts-ignore
            document.getElementById("version")?.innerHTML = "Sirent v" + app.getVersion();

            document.getElementById("homeBtn")?.addEventListener("click", () => {
                view.changeView("home");
            });

            document.getElementById("youtubeBtn")?.addEventListener("click", () => {
                view.changeView("youtube");
            });

            document.getElementById("playBTN")?.addEventListener("click", () => {
                if (player.isPlaying()) {
                    player.pause();
                } else {
                    player.resume();
                }
            });

            document.getElementById("playForward")?.addEventListener("click", () => {
                player.playIndexUp();
                view.loadPlaylist(player.getPlaylist());
            });

            document.getElementById("playBackward")?.addEventListener("click", () => {
                player.playIndexDown();
                view.loadPlaylist(player.getPlaylist());
            });

            document.getElementById("volumeControl")?.addEventListener("click",() => {
                // @ts-ignore
                let value: string = document.getElementById("volumeControl").value;
                player.setVolume((parseInt(value) / 100));
            });

            document.getElementById("playlistAppendBTN")?.addEventListener("click", () => {
                let selectedFiles = dialog.showOpenDialogSync({
                    properties: ["openFile", "multiSelections"],
                    filters: [
                        {
                            extensions: ["mp3", "wav"],
                            name: "Music"
                        }
                    ]
                });

                if (selectedFiles === undefined) {
                    throw "No file selected";
                }

                if (selectedFiles?.length === 0) {
                    throw "No file selected";
                }

                selectedFiles.forEach((value, index, array) => {
                    player.pushPlaylist(value);
                });

                view.loadPlaylist(player.getPlaylist());

            });

            document.getElementById("playlistAppendLinkBTN")?.addEventListener("click", () => {
                // @ts-ignore
                document.getElementById("clearer")?.style.display = "block";
                // @ts-ignore
                document.getElementById("linkView")?.style.display = "block";
            });

            document.getElementById("linkViewSubmit")?.addEventListener("click", () => {
                // @ts-ignore
                let url: string = document.getElementById("linkViewInput").value;
                // @ts-ignore
                document.getElementById("linkViewInput").value = "";

                if (view.getCurrentView() === "costumePlaylist") {
                    let name: string | null | undefined = document.getElementById("customPlaylist")?.getAttribute("playlistName");
                    if (!name) {
                        return;
                    } else {
                        playlist.addItem(name, url);
                        // @ts-ignore
                        view.loadCostumePlaylist(playlist.getPlaylistByName(name));
                    }
                } else {
                    player.pushPlaylist(url);
                }

                // @ts-ignore
                document.getElementById("linkView")?.style.display = "none";
                // @ts-ignore
                document.getElementById("clearer")?.style.display = "none";

                if (view.getCurrentView() !== "costumePlaylist") {
                    view.loadPlaylist(player.getPlaylist());
                }
            });

            document.getElementById("linkViewCancel")?.addEventListener("click", () => {
                // @ts-ignore
                document.getElementById("linkView")?.style.display = "none";
                // @ts-ignore
                document.getElementById("clearer")?.style.display = "none";
            });

            document.getElementById("playlistClearBTN")?.addEventListener("click", () => {
                if (player.isPlaying()) {
                    player.pause();
                }

                player.setPlaylist([]);
                player.unLoad();
                // @ts-ignore
                document.getElementById("barFill")?.style.width = "0%";
                view.loadPlaylist(player.getPlaylist());
            });

            document.getElementById("loadPlaylistURLSubmit")?.addEventListener("click", () => {
                // @ts-ignore
                ytpl.getPlaylistID(document.getElementById("loadPlaylistURL").value).then((id) => {
                    ytpl(id).then((playlist: ytpl.Result) => {
                        let list: string[] = [];
                        playlist.items.forEach((value) => {
                            list.push(value.shortUrl);
                        });
                        player.setIndex(0);
                        player.setPlaylist(list);
                        player.play();
                        // @ts-ignore
                        document.getElementById("loadPlaylistURL").value = "";
                    });
                });
            });

            document.getElementById("loadVideoURLSubmit")?.addEventListener("click", () => {
                // @ts-ignore
                if (document.getElementById("loadPlaylistURL").value !== "") {
                    // @ts-ignore
                    player.setPlaylist([document.getElementById("loadPlaylistURL").value]);
                    player.setIndex(0);
                    player.play();

                    // @ts-ignore
                    document.getElementById("loadPlaylistURL").value = "";
                }
            });

            document.getElementsByClassName("addPlaylistButton")[0]?.addEventListener("click", () => {
                // @ts-ignore
                document.getElementById("clearer")?.style.display = "block";
                // @ts-ignore
                document.getElementById("playlistView")?.style.display = "block";
            });

            document.getElementById("playlistViewSubmit")?.addEventListener("click", () => {
                // @ts-ignore
                if (document.getElementById("playlistViewInput").value !== "") {
                    // @ts-ignore
                    playlist.add(document.getElementById("playlistViewInput").value);

                    playlist.build("list", document.getElementsByClassName("playlistList")[0], (playlist) => {
                        view.changeView("costumePlaylist");
                        document.getElementById("customPlaylist")?.setAttribute("playlistName", playlist.name);
                        view.loadCostumePlaylist(playlist);
                    });
                    if (view.getCurrentView() === "home") {
                        view.changeView("home");
                    }
                }

                // @ts-ignore
                document.getElementById("clearer")?.style.display = "none";
                // @ts-ignore
                document.getElementById("playlistView")?.style.display = "none";
            });

            document.getElementById("playlistViewCancel")?.addEventListener("click", () => {
                // @ts-ignore
                document.getElementById("clearer")?.style.display = "none";
                // @ts-ignore
                document.getElementById("playlistView")?.style.display = "none";
            });

            document.getElementById("customPlaylistPlayBTN")?.addEventListener("click", () => {
                // @ts-ignore
                let name: string | null = document.getElementById("customPlaylist")?.getAttribute("playlistName");
                if (name === null) {
                    return;
                } else {
                    let list: IPlaylist | null = playlist.getPlaylistByName(name);
                    if (list) {
                        if (player.isPlaying()) {
                            player.pause();
                        }

                        player.setIndex(0);
                        player.setPlaylist(list.items);
                        player.play();

                        view.changeView("playlist");
                    }
                }
            });

            document.getElementById("customPlaylistAppendLinkBTN")?.addEventListener("click", () => {
                // @ts-ignore
                document.getElementById("clearer")?.style.display = "block";
                // @ts-ignore
                document.getElementById("linkView")?.style.display = "block";
            });

            document.getElementById("customPlaylistAppendBTN")?.addEventListener("click", () => {
                let name: string | null | undefined = document.getElementById("customPlaylist")?.getAttribute("playlistName");
                if (!name) {
                    throw "No name";
                } else {
                    let selectedFiles = dialog.showOpenDialogSync({
                        properties: ["openFile", "multiSelections"],
                        filters: [
                            {
                                extensions: ["mp3", "wav"],
                                name: "Music"
                            }
                        ]
                    });

                    if (selectedFiles === undefined) {
                        throw "No file selected";
                    }

                    if (selectedFiles?.length === 0) {
                        throw "No file selected";
                    }

                    selectedFiles.forEach((value, index, array) => {
                        // @ts-ignore
                        playlist.addItem(name, value);
                    });

                    // @ts-ignore
                    view.loadCostumePlaylist(playlist.getPlaylistByName(name));
                }
            });

            document.getElementById("customPlaylistDeleteBTN")?.addEventListener("click", () => {
                let name: string | null | undefined = document.getElementById("customPlaylist")?.getAttribute("playlistName");
                if (!name) {
                    throw "No name";
                } else {
                    playlist.deleteByName(name);
                    playlist.build("list", document.getElementsByClassName("playlistList")[0], (playlist) => {
                        view.changeView("costumePlaylist");
                        document.getElementById("customPlaylist")?.setAttribute("playlistName", playlist.name);
                        view.loadCostumePlaylist(playlist);
                    });
                    view.changeView("home");
                }
            });

            window.addEventListener("resize", this.reloadStyles);
            this.reloadStyles();
            view.changeView("home"); // TODO change this to a flexible load with setting file

            player.on("play", () => {
                document.getElementById("playBTN")?.classList.remove("fa-play-circle");
                document.getElementById("playBTN")?.classList.add("fa-pause-circle");
            });

            player.on("stop", () => {
                document.getElementById("playBTN")?.classList.remove("fa-pause-circle");
                document.getElementById("playBTN")?.classList.add("fa-play-circle");
            });

            player.on("timeChange", () => {
                // @ts-ignore
                document.getElementById("timeSpan")?.innerHTML = player.getTimeData("duration") + "/" + player.getTimeData("current");
                // @ts-ignore
                document.getElementById("barFill")?.style.width = player.getBarData().toString() + "%";
            });

            player.on("end", () => {
                view.loadPlaylist(player.getPlaylist());
            });

            player.on("information", () => {
                // @ts-ignore
                document.getElementById("playerInfo")?.innerHTML = player.getLastInformation();
            });
        }

        public static main(): void {
            new Main();
        }

        private reloadStyles(): void {
            // @ts-ignore
            document.getElementsByClassName("playlistList")[0].style.height = (window.innerHeight - 261).toString() + "px";

            // @ts-ignore
            document.getElementsByClassName("playlistWrapper")[0].style.height = (window.innerHeight - 200).toString() + "px";
            // @ts-ignore
            document.getElementsByClassName("playlistWrapper")[1].style.height = (window.innerHeight - 200).toString() + "px";
        }
    }

    export class Views {
        private home: HTMLElement;
        private youtube: HTMLElement;
        private playlist: HTMLElement;
        private costumePlaylist: HTMLElement;
        private currentView: "home" | "youtube" | "playlist" | "costumePlaylist" = "home";

        constructor() {
            // @ts-ignore
            this.home = document.getElementById("home");
            // @ts-ignore
            this.youtube = document.getElementById("youtube");
            // @ts-ignore
            this.playlist = document.getElementById("playlist");
            // @ts-ignore
            this.costumePlaylist = document.getElementById("customPlaylist");
        }

        public changeView(view: "home" | "youtube" | "playlist" | "costumePlaylist"): void {
            document.getElementById("homeBtn")?.classList.remove("active");
            document.getElementById("youtubeBtn")?.classList.remove("active");

            this.home.style.display = "none";
            this.youtube.style.display = "none";
            this.playlist.style.display = "none";
            this.costumePlaylist.style.display = "none";
            this.currentView = view;

            if (view === "home") {
                this.load("home");
                this.home.style.display = "";
                document.getElementById("homeBtn")?.classList.add("active");
            }

            if (view === "youtube") {
                this.load("youtube");
                this.youtube.style.display = "";
                document.getElementById("youtubeBtn")?.classList.add("active");
            }

            if (view === "playlist") {
                this.load("playlist");
                this.playlist.style.display = "";
            }

            if (view === "costumePlaylist") {
                this.load("costumePlaylist");
                this.costumePlaylist.style.display = "";
            }
        }

        private load(view: "home" | "youtube" | "playlist" | "costumePlaylist"): void {
            switch (view) {
                case "home":
                    this.loadHomeCards();
                    break;
                case "youtube":
                    break;
                case "playlist":
                    this.loadPlaylist(player.getPlaylist());
                    break;
                case "costumePlaylist":
                    break;
            }
        }

        public getCurrentView(): "home" | "youtube" | "playlist" | "costumePlaylist" {
            return this.currentView;
        }

        public loadPlaylist(list: string[]): void {
            // @ts-ignore
            let table: HTMLElement = document.getElementById("playlistTable");
            table.innerHTML = "";

            list.forEach((value, index, array) => {
                let tr: HTMLTableRowElement = document.createElement("tr");
                if (index === player.getPlayIndex()) {
                    tr.classList.add("active");
                }
                tr.addEventListener("click", () => {
                    player.setIndex(index);
                    player.play();

                    this.loadPlaylist(player.getPlaylist());
                });

                let td1: HTMLTableCellElement = document.createElement("td");
                td1.innerHTML = (index + 1).toString();
                td1.style.width = "30px";
                let td2: HTMLTableCellElement = document.createElement("td");
                if (this.isUrl(value)) {
                    td2.innerHTML = value;
                } else {
                    td2.innerHTML = path.basename(value);
                }

                tr.appendChild(td1);
                tr.appendChild(td2);

                table.appendChild(tr);
            });
        }

        public loadCostumePlaylist(playlist: IPlaylist) {
            // @ts-ignore
            let table: HTMLElement = document.getElementById("customPlaylistTable");
            document.getElementById("playlistName")?.setAttribute("playlistName", playlist.name);
            table.innerHTML = "";
            let list: string[] = playlist.items;

            list.forEach((value, index, array) => {
                let tr: HTMLTableRowElement = document.createElement("tr");
                let td1: HTMLTableCellElement = document.createElement("td");
                td1.innerHTML = (index + 1).toString();
                td1.style.width = "30px";
                let td2: HTMLTableCellElement = document.createElement("td");
                if (this.isUrl(value)) {
                    td2.innerHTML = value;
                } else {
                    td2.innerHTML = path.basename(value);
                }

                tr.appendChild(td1);
                tr.appendChild(td2);

                table.appendChild(tr);
            });
        }

        private loadHomeCards(): void {
            // @ts-ignore
            document.getElementById("cardPanel")?.innerHTML = "";
            // @ts-ignore
            const cardElement: HTMLElement = document.getElementById("cardPanel");


            const openFolder: HTMLDivElement = document.createElement("div");
            openFolder.innerHTML = "<a>Open Folder</a><br><i class=\"fal fa-folder-open\"></i>";
            openFolder.addEventListener("click", () => {
                let selectedDir = dialog.showOpenDialogSync({
                    title: "Open Folder",
                    properties: ["openDirectory"]
                });

                if (selectedDir?.length !== 1) {
                    throw "No folder selected";
                }

                const entries: string[] = fs.readdirSync(selectedDir[0]);
                const musicFiles: string[] = [];

                for (let i: number = 0; i < entries.length; i++) {
                    let mimeType: string = mime.getType(entries[i]);
                    if (mimeType === "audio/mpeg" || mimeType === "audio/wave") {
                        musicFiles.push(path.join(selectedDir[0], entries[i]));
                    }
                }

                player.setIndex(0)
                player.setPlaylist(musicFiles);
                player.play();
            });

            cardElement.appendChild(openFolder);

            const openFiles: HTMLDivElement = document.createElement("div");
            openFiles.innerHTML = "<a>Open Files</a><br><i class=\"fal fa-file-audio\"></i>";
            openFiles.addEventListener("click", () => {
                let selectedFiles: string[] | undefined = dialog.showOpenDialogSync({
                    title: "Open Files",
                    filters: [
                        {
                            name: "Music",
                            extensions: ["mp3", "wav"]
                        }
                    ],
                    properties: ["openFile", "multiSelections"]
                });

                if (selectedFiles === undefined) {
                    throw "No file selected";
                }

                if (selectedFiles?.length === 0) {
                    throw "No file selected";
                }

                player.setPlaylist(selectedFiles);
                player.setIndex(0)
                player.play();
            });

            cardElement.appendChild(openFiles);

            const currentPlaying: HTMLDivElement = document.createElement("div");
            currentPlaying.innerHTML = "<a>Now Playing</a><br><i class=\"fal fa-music\"></i>";
            currentPlaying.addEventListener("click", () => {
                this.changeView("playlist");
            });

            cardElement.appendChild(currentPlaying);

            playlist.build("block", cardElement, (playlist) => {
                this.changeView("costumePlaylist");
                document.getElementById("customPlaylist")?.setAttribute("playlistName", playlist.name);
                this.loadCostumePlaylist(playlist);
            });
        }

        private isUrl(str: string) {
            let pattern = new RegExp('^(https?:\\/\\/)?' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$', 'i');
            return pattern.test(str);
        }
    }
}


