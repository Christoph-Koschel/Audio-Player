"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
var AutoGitUpdate = require("auto-git-update");
function update(temp) {
    var config = {
        repository: "https://github.com/Christoph-Koschel/Audio-Player",
        tempLocation: temp,
        exitOnComplete: true
    };
    var updater = new AutoGitUpdate(config);
    updater.autoUpdate();
}
exports.update = update;
//# sourceMappingURL=updater.js.map