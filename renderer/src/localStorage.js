"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
var fs = require("fs");
var electron_1 = require("electron");
var path = require("path");
var crypto_1 = require("./crypto");
var Hash = crypto_1.Crypto.Hash;
var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.getItem = function (key) {
        var storage = this.load();
        if (storage[key]) {
            return storage[key];
        }
        else {
            return "";
        }
    };
    LocalStorage.prototype.setItem = function (key, value) {
        var storage = this.load();
        storage[key] = value;
        this.update(storage);
    };
    LocalStorage.prototype.hasItem = function (key) {
        var storage = this.load();
        return (storage[key]);
    };
    LocalStorage.prototype.load = function () {
        if (fs.existsSync(LocalStorage.storagePath)) {
            var storage = fs.readFileSync(LocalStorage.storagePath, "utf8");
            storage = Hash.decode(storage, "localStorage");
            try {
                var json = JSON.parse(storage);
                if (typeof json === "object") {
                    return json;
                }
                else {
                    throw "Error on LocalStorage";
                }
            }
            catch (_a) {
                throw "Error on LocalStorage";
            }
        }
        else {
            fs.writeFileSync(LocalStorage.storagePath, Hash.encode("{}", "localStorage"));
            return {};
        }
    };
    LocalStorage.prototype.update = function (storage) {
        fs.writeFileSync(LocalStorage.storagePath, Hash.encode(JSON.stringify(storage), "localStorage"));
    };
    LocalStorage.storagePath = path.join(electron_1.remote.app.getPath("userData"), "localstorage");
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=localStorage.js.map