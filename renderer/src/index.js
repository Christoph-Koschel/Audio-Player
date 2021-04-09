"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var ytpl = require("ytpl");
var player_1 = require("./player");
var playlist_1 = require("./playlist");
var mime = require("mime");
var Index;
(function (Index) {
    var app = electron_1.remote.app;
    var dialog = electron_1.remote.dialog;
    var player = new player_1.Player();
    var playlist = new playlist_1.Playlist(path.join(app.getPath("userData"), "playlist"));
    var Main = (function () {
        function Main() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
            var params = new URLSearchParams(window.location.search);
            var view = new Views();
            playlist.build("list", document.getElementsByClassName("playlistList")[0], function (playlist) {
                var _a;
                view.changeView("costumePlaylist");
                (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlist.name);
                view.loadCostumePlaylist(playlist);
            });
            console.log(params.get("path"));
            (_a = document.getElementById("winClose")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                electron_1.remote.getCurrentWindow().close();
            });
            (_b = document.getElementById("winMin")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
                electron_1.remote.getCurrentWindow().minimize();
            });
            (_c = document.getElementById("winSize")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
                if (electron_1.remote.getCurrentWindow().isMaximized()) {
                    electron_1.remote.getCurrentWindow().unmaximize();
                }
                else {
                    electron_1.remote.getCurrentWindow().maximize();
                }
            });
            (_d = document.getElementById("version")) === null || _d === void 0 ? void 0 : _d.innerHTML = "Sirent v" + app.getVersion();
            (_e = document.getElementById("homeBtn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", function () {
                view.changeView("home");
            });
            (_f = document.getElementById("youtubeBtn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", function () {
                view.changeView("youtube");
            });
            (_g = document.getElementById("playBTN")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", function () {
                if (player.isPlaying()) {
                    player.pause();
                }
                else {
                    player.resume();
                }
            });
            (_h = document.getElementById("playForward")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", function () {
                player.playIndexUp();
                view.loadPlaylist(player.getPlaylist());
            });
            (_j = document.getElementById("playBackward")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", function () {
                player.playIndexDown();
                view.loadPlaylist(player.getPlaylist());
            });
            (_k = document.getElementById("volumeControl")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", function () {
                var value = document.getElementById("volumeControl").value;
                player.setVolume((parseInt(value) / 100));
            });
            (_l = document.getElementById("playlistAppendBTN")) === null || _l === void 0 ? void 0 : _l.addEventListener("click", function () {
                var selectedFiles = dialog.showOpenDialogSync({
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
                if ((selectedFiles === null || selectedFiles === void 0 ? void 0 : selectedFiles.length) === 0) {
                    throw "No file selected";
                }
                selectedFiles.forEach(function (value, index, array) {
                    player.pushPlaylist(value);
                });
                view.loadPlaylist(player.getPlaylist());
            });
            (_m = document.getElementById("playlistAppendLinkBTN")) === null || _m === void 0 ? void 0 : _m.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
                (_b = document.getElementById("linkView")) === null || _b === void 0 ? void 0 : _b.style.display = "block";
            });
            (_o = document.getElementById("linkViewSubmit")) === null || _o === void 0 ? void 0 : _o.addEventListener("click", function () {
                var _a, _b, _c;
                var url = document.getElementById("linkViewInput").value;
                document.getElementById("linkViewInput").value = "";
                if (view.getCurrentView() === "costumePlaylist") {
                    var name_1 = (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.getAttribute("playlistName");
                    if (!name_1) {
                        return;
                    }
                    else {
                        playlist.addItem(name_1, url);
                        view.loadCostumePlaylist(playlist.getPlaylistByName(name_1));
                    }
                }
                else {
                    player.pushPlaylist(url);
                }
                (_b = document.getElementById("linkView")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
                (_c = document.getElementById("clearer")) === null || _c === void 0 ? void 0 : _c.style.display = "none";
                if (view.getCurrentView() !== "costumePlaylist") {
                    view.loadPlaylist(player.getPlaylist());
                }
            });
            (_p = document.getElementById("linkViewCancel")) === null || _p === void 0 ? void 0 : _p.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("linkView")) === null || _a === void 0 ? void 0 : _a.style.display = "none";
                (_b = document.getElementById("clearer")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
            });
            (_q = document.getElementById("playlistClearBTN")) === null || _q === void 0 ? void 0 : _q.addEventListener("click", function () {
                var _a;
                if (player.isPlaying()) {
                    player.pause();
                }
                player.setPlaylist([]);
                player.unLoad();
                (_a = document.getElementById("barFill")) === null || _a === void 0 ? void 0 : _a.style.width = "0%";
                view.loadPlaylist(player.getPlaylist());
            });
            (_r = document.getElementById("loadPlaylistURLSubmit")) === null || _r === void 0 ? void 0 : _r.addEventListener("click", function () {
                ytpl.getPlaylistID(document.getElementById("loadPlaylistURL").value).then(function (id) {
                    ytpl(id).then(function (playlist) {
                        var list = [];
                        playlist.items.forEach(function (value) {
                            list.push(value.shortUrl);
                        });
                        player.setIndex(0);
                        player.setPlaylist(list);
                        player.play();
                        document.getElementById("loadPlaylistURL").value = "";
                    });
                });
            });
            (_s = document.getElementById("loadVideoURLSubmit")) === null || _s === void 0 ? void 0 : _s.addEventListener("click", function () {
                if (document.getElementById("loadPlaylistURL").value !== "") {
                    player.setPlaylist([document.getElementById("loadPlaylistURL").value]);
                    player.setIndex(0);
                    player.play();
                    document.getElementById("loadPlaylistURL").value = "";
                }
            });
            (_t = document.getElementsByClassName("addPlaylistButton")[0]) === null || _t === void 0 ? void 0 : _t.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
                (_b = document.getElementById("playlistView")) === null || _b === void 0 ? void 0 : _b.style.display = "block";
            });
            (_u = document.getElementById("playlistViewSubmit")) === null || _u === void 0 ? void 0 : _u.addEventListener("click", function () {
                var _a, _b;
                if (document.getElementById("playlistViewInput").value !== "") {
                    playlist.add(document.getElementById("playlistViewInput").value);
                    playlist.build("list", document.getElementsByClassName("playlistList")[0], function (playlist) {
                        var _a;
                        view.changeView("costumePlaylist");
                        (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlist.name);
                        view.loadCostumePlaylist(playlist);
                    });
                    if (view.getCurrentView() === "home") {
                        view.changeView("home");
                    }
                }
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "none";
                (_b = document.getElementById("playlistView")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
            });
            (_v = document.getElementById("playlistViewCancel")) === null || _v === void 0 ? void 0 : _v.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "none";
                (_b = document.getElementById("playlistView")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
            });
            (_w = document.getElementById("customPlaylistPlayBTN")) === null || _w === void 0 ? void 0 : _w.addEventListener("click", function () {
                var _a;
                var name = (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.getAttribute("playlistName");
                if (name === null) {
                    return;
                }
                else {
                    var list = playlist.getPlaylistByName(name);
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
            (_x = document.getElementById("customPlaylistAppendLinkBTN")) === null || _x === void 0 ? void 0 : _x.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
                (_b = document.getElementById("linkView")) === null || _b === void 0 ? void 0 : _b.style.display = "block";
            });
            (_y = document.getElementById("customPlaylistAppendBTN")) === null || _y === void 0 ? void 0 : _y.addEventListener("click", function () {
                var _a;
                var name = (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.getAttribute("playlistName");
                if (!name) {
                    throw "No name";
                }
                else {
                    var selectedFiles = dialog.showOpenDialogSync({
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
                    if ((selectedFiles === null || selectedFiles === void 0 ? void 0 : selectedFiles.length) === 0) {
                        throw "No file selected";
                    }
                    selectedFiles.forEach(function (value, index, array) {
                        playlist.addItem(name, value);
                    });
                    view.loadCostumePlaylist(playlist.getPlaylistByName(name));
                }
            });
            (_z = document.getElementById("customPlaylistDeleteBTN")) === null || _z === void 0 ? void 0 : _z.addEventListener("click", function () {
                var _a;
                var name = (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.getAttribute("playlistName");
                if (!name) {
                    throw "No name";
                }
                else {
                    playlist.deleteByName(name);
                    playlist.build("list", document.getElementsByClassName("playlistList")[0], function (playlist) {
                        var _a;
                        view.changeView("costumePlaylist");
                        (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlist.name);
                        view.loadCostumePlaylist(playlist);
                    });
                    view.changeView("home");
                }
            });
            window.addEventListener("resize", this.reloadStyles);
            this.reloadStyles();
            view.changeView("home");
            player.on("play", function () {
                var _a, _b;
                (_a = document.getElementById("playBTN")) === null || _a === void 0 ? void 0 : _a.classList.remove("fa-play-circle");
                (_b = document.getElementById("playBTN")) === null || _b === void 0 ? void 0 : _b.classList.add("fa-pause-circle");
            });
            player.on("stop", function () {
                var _a, _b;
                (_a = document.getElementById("playBTN")) === null || _a === void 0 ? void 0 : _a.classList.remove("fa-pause-circle");
                (_b = document.getElementById("playBTN")) === null || _b === void 0 ? void 0 : _b.classList.add("fa-play-circle");
            });
            player.on("timeChange", function () {
                var _a, _b;
                (_a = document.getElementById("timeSpan")) === null || _a === void 0 ? void 0 : _a.innerHTML = player.getTimeData("duration") + "/" + player.getTimeData("current");
                (_b = document.getElementById("barFill")) === null || _b === void 0 ? void 0 : _b.style.width = player.getBarData().toString() + "%";
            });
            player.on("end", function () {
                view.loadPlaylist(player.getPlaylist());
            });
            player.on("information", function () {
                var _a;
                (_a = document.getElementById("playerInfo")) === null || _a === void 0 ? void 0 : _a.innerHTML = player.getLastInformation();
            });
        }
        Main.main = function () {
            new Main();
        };
        Main.prototype.reloadStyles = function () {
            document.getElementsByClassName("playlistList")[0].style.height = (window.innerHeight - 261).toString() + "px";
            document.getElementsByClassName("playlistWrapper")[0].style.height = (window.innerHeight - 200).toString() + "px";
            document.getElementsByClassName("playlistWrapper")[1].style.height = (window.innerHeight - 200).toString() + "px";
        };
        return Main;
    }());
    Index.Main = Main;
    var Views = (function () {
        function Views() {
            this.currentView = "home";
            this.home = document.getElementById("home");
            this.youtube = document.getElementById("youtube");
            this.playlist = document.getElementById("playlist");
            this.costumePlaylist = document.getElementById("customPlaylist");
        }
        Views.prototype.changeView = function (view) {
            var _a, _b, _c, _d;
            (_a = document.getElementById("homeBtn")) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
            (_b = document.getElementById("youtubeBtn")) === null || _b === void 0 ? void 0 : _b.classList.remove("active");
            this.home.style.display = "none";
            this.youtube.style.display = "none";
            this.playlist.style.display = "none";
            this.costumePlaylist.style.display = "none";
            this.currentView = view;
            if (view === "home") {
                this.load("home");
                this.home.style.display = "";
                (_c = document.getElementById("homeBtn")) === null || _c === void 0 ? void 0 : _c.classList.add("active");
            }
            if (view === "youtube") {
                this.load("youtube");
                this.youtube.style.display = "";
                (_d = document.getElementById("youtubeBtn")) === null || _d === void 0 ? void 0 : _d.classList.add("active");
            }
            if (view === "playlist") {
                this.load("playlist");
                this.playlist.style.display = "";
            }
            if (view === "costumePlaylist") {
                this.load("costumePlaylist");
                this.costumePlaylist.style.display = "";
            }
        };
        Views.prototype.load = function (view) {
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
        };
        Views.prototype.getCurrentView = function () {
            return this.currentView;
        };
        Views.prototype.loadPlaylist = function (list) {
            var _this = this;
            var table = document.getElementById("playlistTable");
            table.innerHTML = "";
            list.forEach(function (value, index, array) {
                var tr = document.createElement("tr");
                if (index === player.getPlayIndex()) {
                    tr.classList.add("active");
                }
                tr.addEventListener("click", function () {
                    player.setIndex(index);
                    player.play();
                    _this.loadPlaylist(player.getPlaylist());
                });
                var td1 = document.createElement("td");
                td1.innerHTML = (index + 1).toString();
                td1.style.width = "30px";
                var td2 = document.createElement("td");
                if (_this.isUrl(value)) {
                    td2.innerHTML = value;
                }
                else {
                    td2.innerHTML = path.basename(value);
                }
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            });
        };
        Views.prototype.loadCostumePlaylist = function (playlist) {
            var _this = this;
            var _a;
            var table = document.getElementById("customPlaylistTable");
            (_a = document.getElementById("playlistName")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlist.name);
            table.innerHTML = "";
            var list = playlist.items;
            list.forEach(function (value, index, array) {
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.innerHTML = (index + 1).toString();
                td1.style.width = "30px";
                var td2 = document.createElement("td");
                if (_this.isUrl(value)) {
                    td2.innerHTML = value;
                }
                else {
                    td2.innerHTML = path.basename(value);
                }
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            });
        };
        Views.prototype.loadHomeCards = function () {
            var _this = this;
            var _a;
            (_a = document.getElementById("cardPanel")) === null || _a === void 0 ? void 0 : _a.innerHTML = "";
            var cardElement = document.getElementById("cardPanel");
            var openFolder = document.createElement("div");
            openFolder.innerHTML = "<a>Open Folder</a><br><i class=\"fal fa-folder-open\"></i>";
            openFolder.addEventListener("click", function () {
                var selectedDir = dialog.showOpenDialogSync({
                    title: "Open Folder",
                    properties: ["openDirectory"]
                });
                if ((selectedDir === null || selectedDir === void 0 ? void 0 : selectedDir.length) !== 1) {
                    throw "No folder selected";
                }
                var entries = fs.readdirSync(selectedDir[0]);
                var musicFiles = [];
                for (var i = 0; i < entries.length; i++) {
                    var mimeType = mime.getType(entries[i]);
                    if (mimeType === "audio/mpeg" || mimeType === "audio/wave") {
                        musicFiles.push(path.join(selectedDir[0], entries[i]));
                    }
                }
                player.setIndex(0);
                player.setPlaylist(musicFiles);
                player.play();
            });
            cardElement.appendChild(openFolder);
            var openFiles = document.createElement("div");
            openFiles.innerHTML = "<a>Open Files</a><br><i class=\"fal fa-file-audio\"></i>";
            openFiles.addEventListener("click", function () {
                var selectedFiles = dialog.showOpenDialogSync({
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
                if ((selectedFiles === null || selectedFiles === void 0 ? void 0 : selectedFiles.length) === 0) {
                    throw "No file selected";
                }
                player.setPlaylist(selectedFiles);
                player.setIndex(0);
                player.play();
            });
            cardElement.appendChild(openFiles);
            var currentPlaying = document.createElement("div");
            currentPlaying.innerHTML = "<a>Now Playing</a><br><i class=\"fal fa-music\"></i>";
            currentPlaying.addEventListener("click", function () {
                _this.changeView("playlist");
            });
            cardElement.appendChild(currentPlaying);
            playlist.build("block", cardElement, function (playlist) {
                var _a;
                _this.changeView("costumePlaylist");
                (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlist.name);
                _this.loadCostumePlaylist(playlist);
            });
        };
        Views.prototype.isUrl = function (str) {
            var pattern = new RegExp('^(https?:\\/\\/)?' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$', 'i');
            return pattern.test(str);
        };
        return Views;
    }());
    Index.Views = Views;
})(Index = exports.Index || (exports.Index = {}));
//# sourceMappingURL=index.js.map