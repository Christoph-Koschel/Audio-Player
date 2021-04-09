"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
var crypto_1 = require("crypto");
var bcrypt = require("bcrypt");
var Crypto;
(function (Crypto) {
    var Hash = (function () {
        function Hash() {
        }
        Hash.decode = function (hash, password) {
            var key = crypto_1.createDecipher('aes-128-cbc', password);
            var decodedString = key.update(hash, 'hex', 'utf8');
            decodedString += key.final('utf8');
            return decodedString;
        };
        Hash.encode = function (text, password) {
            var key = crypto_1.createCipher('aes-128-cbc', password);
            var encodedString = key.update(text, 'utf8', 'hex');
            encodedString += key.final('hex');
            return encodedString;
        };
        return Hash;
    }());
    Crypto.Hash = Hash;
    var Password = (function () {
        function Password() {
        }
        Password.hash = function (password) {
            return bcrypt.hashSync(password, 10);
        };
        Password.verify = function (hash, password) {
            return bcrypt.compareSync(password, hash);
        };
        return Password;
    }());
    Crypto.Password = Password;
})(Crypto = exports.Crypto || (exports.Crypto = {}));
//# sourceMappingURL=crypto.js.map