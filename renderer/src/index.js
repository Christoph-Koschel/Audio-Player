"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var ytpl = require("ytpl");
var player_1 = require("./player");
var playlist_1 = require("./playlist");
var localStorage_1 = require("./localStorage");
var animation_1 = require("./animation");
var mime = require("mime");
var Index;
(function (Index) {
    var app = electron_1.remote.app;
    var dialog = electron_1.remote.dialog;
    var player = new player_1.Player();
    var animation;
    var openSiteMenu = true;
    var playlist = new playlist_1.Playlist(path.join(app.getPath("userData"), "playlist"));
    var localStorage = new localStorage_1.LocalStorage();
    var Main = (function () {
        function Main() {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
            var params = new URLSearchParams(window.location.search);
            var view = new Views();
            playlist.build("list", document.getElementsByClassName("playlistList")[0], function (playlist) {
                var _a;
                view.changeView("costumePlaylist");
                (_a = document.getElementById("customPlaylist")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlist.name);
                view.loadCostumePlaylist(playlist);
            });
            if (!localStorage.hasItem("terms") || localStorage.getItem("terms") !== "1") {
                document.getElementById("terms").style.display = "block";
            }
            if (!localStorage.hasItem("view")) {
                localStorage.setItem("view", "home");
            }
            if (!localStorage.hasItem("volume")) {
                localStorage.setItem("volume", "0.5");
            }
            if (!localStorage.hasItem("openSiteMenu")) {
                localStorage.setItem("openSiteMenu", "true");
            }
            if (JSON.parse(params.get("path")).length !== 0) {
                player.setPlaylist(JSON.parse(params.get("path")));
                player.setIndex(0);
                player.play();
            }
            openSiteMenu = (localStorage.getItem("openSiteMenu") !== "true");
            this.setSideMenu(false);
            player.setVolume(parseFloat(localStorage.getItem("volume")));
            document.getElementById("volumeControl").value = parseFloat(localStorage.getItem("volume")) * 100;
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
            (_d = document.getElementById("termsView").contentWindow.document.getElementById("sub")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () {
                localStorage.setItem("terms", "1");
                document.getElementById("terms").style.display = "none";
            });
            (_e = document.getElementById("animationBtn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", function () {
                view.changeView("animation");
            });
            (_f = document.getElementById("version")) === null || _f === void 0 ? void 0 : _f.innerHTML = "Sirent v" + app.getVersion();
            (_g = document.getElementById("homeBtn")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", function () {
                view.changeView("home");
            });
            (_h = document.getElementById("youtubeBtn")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", function () {
                view.changeView("youtube");
            });
            (_j = document.getElementById("playBTN")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", function () {
                if (player.isPlaying()) {
                    player.pause();
                }
                else {
                    player.resume();
                }
            });
            (_k = document.getElementById("playForward")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", function () {
                player.playIndexUp();
                view.loadPlaylist(player.getPlaylist());
            });
            (_l = document.getElementById("playBackward")) === null || _l === void 0 ? void 0 : _l.addEventListener("click", function () {
                player.playIndexDown();
                view.loadPlaylist(player.getPlaylist());
            });
            (_m = document.getElementById("volumeControl")) === null || _m === void 0 ? void 0 : _m.addEventListener("click", function () {
                var value = document.getElementById("volumeControl").value;
                localStorage.setItem("volume", (parseInt(value) / 100).toString());
                player.setVolume((parseInt(value) / 100));
            });
            (_o = document.getElementById("playlistAppendBTN")) === null || _o === void 0 ? void 0 : _o.addEventListener("click", function () {
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
            (_p = document.getElementById("playlistAppendLinkBTN")) === null || _p === void 0 ? void 0 : _p.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
                (_b = document.getElementById("linkView")) === null || _b === void 0 ? void 0 : _b.style.display = "block";
            });
            (_q = document.getElementById("linkViewSubmit")) === null || _q === void 0 ? void 0 : _q.addEventListener("click", function () {
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
            (_r = document.getElementById("linkViewCancel")) === null || _r === void 0 ? void 0 : _r.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("linkView")) === null || _a === void 0 ? void 0 : _a.style.display = "none";
                (_b = document.getElementById("clearer")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
            });
            (_s = document.getElementById("playlistClearBTN")) === null || _s === void 0 ? void 0 : _s.addEventListener("click", function () {
                var _a;
                if (player.isPlaying()) {
                    player.pause();
                }
                player.setPlaylist([]);
                player.unLoad();
                (_a = document.getElementById("barFill")) === null || _a === void 0 ? void 0 : _a.style.width = "0%";
                view.loadPlaylist(player.getPlaylist());
            });
            (_t = document.getElementById("loadPlaylistURLSubmit")) === null || _t === void 0 ? void 0 : _t.addEventListener("click", function () {
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
            (_u = document.getElementById("loadVideoURLSubmit")) === null || _u === void 0 ? void 0 : _u.addEventListener("click", function () {
                if (document.getElementById("loadVideoURL").value !== "") {
                    player.setPlaylist([document.getElementById("loadVideoURL").value]);
                    player.setIndex(0);
                    player.play();
                    document.getElementById("loadVideoURL").value = "";
                }
            });
            (_v = document.getElementsByClassName("addPlaylistButton")[0]) === null || _v === void 0 ? void 0 : _v.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
                (_b = document.getElementById("playlistView")) === null || _b === void 0 ? void 0 : _b.style.display = "block";
            });
            window.addEventListener("mousemove", function () {
                if (_this.mouseInterval) {
                    clearTimeout(_this.mouseInterval);
                }
                document.getElementById("minimizeDot").style.display = "";
                document.body.style.cursor = "";
                _this.mouseInterval = setTimeout(function () {
                    document.getElementById("minimizeDot").style.display = "none";
                    document.body.style.cursor = "none";
                }, 20 * 1000);
            });
            (_w = document.getElementById("playlistViewSubmit")) === null || _w === void 0 ? void 0 : _w.addEventListener("click", function () {
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
            (_x = document.getElementById("playlistViewCancel")) === null || _x === void 0 ? void 0 : _x.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "none";
                (_b = document.getElementById("playlistView")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
            });
            (_y = document.getElementById("customPlaylistPlayBTN")) === null || _y === void 0 ? void 0 : _y.addEventListener("click", function () {
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
            (_z = document.getElementById("customPlaylistAppendLinkBTN")) === null || _z === void 0 ? void 0 : _z.addEventListener("click", function () {
                var _a, _b;
                (_a = document.getElementById("clearer")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
                (_b = document.getElementById("linkView")) === null || _b === void 0 ? void 0 : _b.style.display = "block";
            });
            (_0 = document.getElementById("customPlaylistAppendBTN")) === null || _0 === void 0 ? void 0 : _0.addEventListener("click", function () {
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
            (_1 = document.getElementById("customPlaylistDeleteBTN")) === null || _1 === void 0 ? void 0 : _1.addEventListener("click", function () {
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
            (_2 = document.getElementById("minimizeDot")) === null || _2 === void 0 ? void 0 : _2.addEventListener("click", function () {
                _this.setSideMenu(true);
            });
            window.addEventListener("resize", this.reloadStyles);
            this.reloadStyles();
            view.changeView(localStorage.getItem("view"));
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
            animation = new animation_1.Animation("animationCanvas", player);
            new Main();
        };
        Main.prototype.reloadStyles = function () {
            document.getElementsByClassName("playlistList")[0].style.height = (window.innerHeight - 298).toString() + "px";
            document.getElementsByClassName("playlistWrapper")[0].style.height = (window.innerHeight - 200).toString() + "px";
            document.getElementsByClassName("playlistWrapper")[1].style.height = (window.innerHeight - 200).toString() + "px";
            if (animation instanceof animation_1.Animation) {
                animation.updateSize(openSiteMenu);
            }
        };
        Main.prototype.setSideMenu = function (setOnLocalStorage) {
            if (openSiteMenu) {
                document.getElementsByClassName("siteMenu")[0].style.display = "none";
                document.getElementsByClassName("body")[0].style.marginLeft = "-200px";
                document.querySelector(":root").style.setProperty("--dotPoint-left", "3px");
                if (setOnLocalStorage) {
                    localStorage.setItem("openSiteMenu", "false");
                }
                openSiteMenu = false;
            }
            else {
                document.getElementsByClassName("siteMenu")[0].style.display = "";
                document.getElementsByClassName("body")[0].style.marginLeft = "";
                document.querySelector(":root").style.setProperty("--dotPoint-left", "200px");
                if (setOnLocalStorage) {
                    localStorage.setItem("openSiteMenu", "true");
                }
                openSiteMenu = true;
            }
            this.reloadStyles();
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
            this.animation = document.getElementById("animation");
        }
        Views.prototype.changeView = function (view) {
            var _a, _b, _c, _d, _e, _f;
            (_a = document.getElementById("homeBtn")) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
            (_b = document.getElementById("youtubeBtn")) === null || _b === void 0 ? void 0 : _b.classList.remove("active");
            (_c = document.getElementById("animationBtn")) === null || _c === void 0 ? void 0 : _c.classList.remove("active");
            if (animation instanceof animation_1.Animation) {
                animation.stop();
            }
            this.home.style.display = "none";
            this.youtube.style.display = "none";
            this.playlist.style.display = "none";
            this.costumePlaylist.style.display = "none";
            this.animation.style.display = "none";
            this.currentView = view;
            localStorage.setItem("view", view);
            if (view === "home") {
                this.load("home");
                this.home.style.display = "";
                (_d = document.getElementById("homeBtn")) === null || _d === void 0 ? void 0 : _d.classList.add("active");
            }
            if (view === "youtube") {
                this.load("youtube");
                this.youtube.style.display = "";
                (_e = document.getElementById("youtubeBtn")) === null || _e === void 0 ? void 0 : _e.classList.add("active");
            }
            if (view === "playlist") {
                this.load("playlist");
                this.playlist.style.display = "";
            }
            if (view === "costumePlaylist") {
                this.load("costumePlaylist");
                this.costumePlaylist.style.display = "";
            }
            if (view == "animation") {
                this.load("animation");
                this.animation.style.display = "";
                (_f = document.getElementById("animationBtn")) === null || _f === void 0 ? void 0 : _f.classList.add("active");
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
                case "animation":
                    if (animation instanceof animation_1.Animation) {
                        animation.start();
                    }
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
        Views.prototype.loadCostumePlaylist = function (playlistObj) {
            var _this = this;
            var _a;
            var table = document.getElementById("customPlaylistTable");
            (_a = document.getElementById("playlistName")) === null || _a === void 0 ? void 0 : _a.setAttribute("playlistName", playlistObj.name);
            table.innerHTML = "";
            var list = playlistObj.items;
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
                var td3 = document.createElement("td");
                var upBTN = document.createElement("button");
                upBTN.innerHTML = "<i class=\"fas fa-caret-up\"></i>";
                upBTN.addEventListener("click", function () {
                    playlist.moveUp(playlistObj.name, index);
                    _this.loadCostumePlaylist(playlist.getPlaylistByName(playlistObj.name));
                });
                var td4 = document.createElement("td");
                var downBTN = document.createElement("button");
                downBTN.innerHTML = "<i class=\"fas fa-caret-down\"></i>";
                downBTN.addEventListener("click", function () {
                    playlist.moveDown(playlistObj.name, index);
                    _this.loadCostumePlaylist(playlist.getPlaylistByName(playlistObj.name));
                });
                var td5 = document.createElement("td");
                var deleteBTN = document.createElement("button");
                deleteBTN.innerHTML = "<i class=\"fal fa-trash\"></i>";
                deleteBTN.addEventListener("click", function () {
                    playlist.removeItem(playlistObj.name, index);
                    _this.loadCostumePlaylist(playlist.getPlaylistByName(playlistObj.name));
                });
                if (index !== 0) {
                    td3.appendChild(upBTN);
                }
                if (index !== list.length - 1) {
                    td4.appendChild(downBTN);
                }
                td5.appendChild(deleteBTN);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
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