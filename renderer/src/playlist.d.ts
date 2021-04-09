export interface IPlaylist {
    name: string;
    items: string[];
}
export declare class Playlist {
    private readonly filePath;
    constructor(file: string);
    build(type: "block" | "list", output: HTMLElement | Element | null, eventFunction: {
        (playlist: IPlaylist): void;
    }): void;
    add(name: string): void;
    getPlaylistByName(name: string): IPlaylist | null;
    addItem(playlist: string, item: string): void;
    deleteByName(name: string): void;
    private getPlaylists;
    private setPlaylist;
}
//# sourceMappingURL=playlist.d.ts.map