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
    removeItem(name: string, index: number): void;
    deleteByName(name: string): void;
    moveUp(name: string, index: number): void;
    moveDown(name: string, index: number): void;
    private getPlaylists;
    private swap;
    private setPlaylist;
}
//# sourceMappingURL=playlist.d.ts.map