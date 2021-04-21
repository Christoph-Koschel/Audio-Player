import * as path from "path";

const AutoGitUpdate = require("auto-git-update");

export function update(temp: string) {
    const config = {
        repository: "https://github.com/Christoph-Koschel/Audio-Player",
        tempLocation: temp,
        exitOnComplete: true
    }

    const updater = new AutoGitUpdate(config);

    updater.autoUpdate();
}


