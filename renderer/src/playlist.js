"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
var fs = require("fs");
var crypto_1 = require("./crypto");
var Hash = crypto_1.Crypto.Hash;
var Playlist = (function () {
    function Playlist(file) {
        this.filePath = file;
    }
    Playlist.prototype.build = function (type, output, eventFunction) {
        if (output === null) {
            throw "Output is not a element";
        }
        var playlists = this.getPlaylists();
        if (type === "list") {
            output.innerHTML = "";
        }
        var _loop_1 = function (i) {
            var value = playlists[i];
            if (type === "list") {
                var li = document.createElement("li");
                li.addEventListener("click", function () {
                    eventFunction(value);
                });
                var span = document.createElement("span");
                span.innerHTML = value.name;
                li.appendChild(span);
                output.appendChild(li);
            }
            else if (type === "block") {
                var div = document.createElement("div");
                div.addEventListener("click", function () {
                    eventFunction(value);
                });
                var a = document.createElement("a");
                a.innerHTML = value.name;
                var br = document.createElement("br");
                var i_1 = document.createElement("i");
                i_1.classList.add("fal");
                i_1.classList.add("fa-list");
                div.appendChild(a);
                div.appendChild(br);
                div.appendChild(i_1);
                output.appendChild(div);
            }
        };
        for (var i = 0; i < playlists.length; i++) {
            _loop_1(i);
        }
    };
    Playlist.prototype.add = function (name) {
        var list = this.getPlaylists();
        list.push({
            name: name,
            items: []
        });
        this.setPlaylist(list);
    };
    Playlist.prototype.getPlaylistByName = function (name) {
        var playlists = this.getPlaylists();
        for (var i = 0; i < playlists.length; i++) {
            var value = playlists[i];
            if (value.name === name) {
                return value;
            }
        }
        return null;
    };
    Playlist.prototype.addItem = function (playlist, item) {
        var playlists = this.getPlaylists();
        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].name === playlist) {
                playlists[i].items.push(item);
                break;
            }
        }
        this.setPlaylist(playlists);
    };
    Playlist.prototype.deleteByName = function (name) {
        var playlists = this.getPlaylists();
        var updatedPlaylists = [];
        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].name !== name) {
                updatedPlaylists.push(playlists[i]);
            }
        }
        this.setPlaylist(updatedPlaylists);
    };
    Playlist.prototype.getPlaylists = function () {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, Hash.encode("[]", "ap2"));
            return [];
        }
        else {
            try {
                var file = fs.readFileSync(this.filePath, "utf8");
                file = Hash.decode(file.replace("\n", ""), "ap2");
                var json = JSON.parse(file);
                if (typeof json === "object") {
                    return json;
                }
                else {
                    throw "Error on Playlist File";
                }
            }
            catch (_a) {
                throw "Error on Playlist File";
            }
        }
    };
    Playlist.prototype.setPlaylist = function (list) {
        fs.writeFileSync(this.filePath, Hash.encode(JSON.stringify(list), "ap2"));
    };
    return Playlist;
}());
exports.Playlist = Playlist;
//# sourceMappingURL=playlist.js.map