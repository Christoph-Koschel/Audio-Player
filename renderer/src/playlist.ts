import * as fs from "fs";
import {Crypto} from "./crypto";
import Hash = Crypto.Hash;
import {cpus} from "os";

export interface IPlaylist {
    name: string;
    items: string[];
}

export class Playlist {
    private readonly filePath: string;

    public constructor(file: string) {
        this.filePath = file;
    }

    public build(type: "block" | "list", output: HTMLElement | Element | null, eventFunction: {
        (playlist: IPlaylist): void
    }) {
        if (output === null) {
            throw "Output is not a element";
        }

        let playlists: IPlaylist[] = this.getPlaylists();
        if (type === "list") {
            output.innerHTML = "";
        }

        for (let i: number = 0; i < playlists.length; i++) {
            let value: IPlaylist = playlists[i];
            if (type === "list") {
                let li: HTMLLIElement = document.createElement("li");
                li.addEventListener("click", () => {
                    eventFunction(value);
                });

                let span: HTMLSpanElement = document.createElement("span");
                span.innerHTML = value.name;

                li.appendChild(span);
                output.appendChild(li);

            } else if (type === "block") {
                let div: HTMLDivElement = document.createElement("div");
                div.addEventListener("click", () => {
                    eventFunction(value);
                });
                let a: HTMLAnchorElement = document.createElement("a");
                a.innerHTML = value.name;

                let br: HTMLBRElement = document.createElement("br");
                let i: HTMLElement = document.createElement("i");
                i.classList.add("fal");
                i.classList.add("fa-list");

                div.appendChild(a);
                div.appendChild(br);
                div.appendChild(i);
                output.appendChild(div);
            }
        }
    }

    public add(name: string): void {
        let list: IPlaylist[] = this.getPlaylists();
        list.push({
            name: name,
            items: []
        });
        this.setPlaylist(list);
    }

    public getPlaylistByName(name: string): IPlaylist | null {
        let playlists: IPlaylist[] = this.getPlaylists();
        for (let i: number = 0; i < playlists.length; i++) {
            let value: IPlaylist = playlists[i];
            if (value.name === name) {
                return value;
            }
        }
        return null;
    }

    public addItem(playlist: string, item: string): void {
        let playlists: IPlaylist[] = this.getPlaylists();

        for (let i: number = 0; i < playlists.length; i++) {
            if (playlists[i].name === playlist) {
                playlists[i].items.push(item);
                break;
            }
        }

        this.setPlaylist(playlists);
    }

    public removeItem(name: string, index: number): void {
        let playlists: IPlaylist[] = this.getPlaylists();

        for (let i: number = 0; i < playlists.length; i++) {
            if (playlists[i].name === name) {
                let updatedItems: string[] = [];

                for (let k = 0; k < playlists[i].items.length; k++) {
                    if (k !== index) {
                        updatedItems.push(playlists[i].items[k]);
                    }
                }

                playlists[i].items = updatedItems;
                break;
            }
        }

        this.setPlaylist(playlists);
    }

    public deleteByName(name: string) {
        let playlists: IPlaylist[] = this.getPlaylists();
        let updatedPlaylists: IPlaylist[] = [];
        for (let i: number = 0; i < playlists.length; i++) {
            if (playlists[i].name !== name) {
                updatedPlaylists.push(playlists[i]);
            }
        }

        this.setPlaylist(updatedPlaylists);
    }

    public moveUp(name: string, index: number): void {
        let playlists: IPlaylist[] = this.getPlaylists();
        let updatedPlaylists: IPlaylist[] = [];
        for (let i: number = 0; i < playlists.length; i++) {
            if (playlists[i].name === name) {
                console.log(index)
                playlists[i].items = this.swap(playlists[i].items, index, index -1);
            }

            updatedPlaylists.push(playlists[i]);
        }

        this.setPlaylist(updatedPlaylists);
    }

    public moveDown(name: string, index: number): void {
        let playlists: IPlaylist[] = this.getPlaylists();
        let updatedPlaylists: IPlaylist[] = [];
        for (let i: number = 0; i < playlists.length; i++) {
            if (playlists[i].name === name) {
                console.log(index)
                playlists[i].items = this.swap(playlists[i].items, index, index +1);
            }

            updatedPlaylists.push(playlists[i]);
        }

        this.setPlaylist(updatedPlaylists);
    }

    private getPlaylists(): IPlaylist[] {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, Hash.encode("[]", "ap2"));
            return [];
        } else {
            try {
                let file: string = fs.readFileSync(this.filePath, "utf8");
                file = Hash.decode(file.replace("\n", ""), "ap2");
                let json: any = JSON.parse(file);
                if (typeof json === "object") {
                    return json;
                } else {
                    throw "Error on Playlist File";
                }
            } catch {
                throw "Error on Playlist File";
            }
        }
    }

    private swap(input: any[], indexA: number, indexB: number): any[] {
        let temp = input[indexA];

        input[indexA] = input[indexB];
        input[indexB] = temp;

        return input;
    }

    private setPlaylist(list: IPlaylist[]): void {
        fs.writeFileSync(this.filePath, Hash.encode(JSON.stringify(list), "ap2"));
    }
}
