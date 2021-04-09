import { IPlaylist } from "./playlist";
export declare namespace Index {
    class Main {
        constructor();
        static main(): void;
        private reloadStyles;
    }
    class Views {
        private home;
        private youtube;
        private playlist;
        private costumePlaylist;
        private currentView;
        constructor();
        changeView(view: "home" | "youtube" | "playlist" | "costumePlaylist"): void;
        private load;
        getCurrentView(): "home" | "youtube" | "playlist" | "costumePlaylist";
        loadPlaylist(list: string[]): void;
        loadCostumePlaylist(playlist: IPlaylist): void;
        private loadHomeCards;
        private isUrl;
    }
}
//# sourceMappingURL=index.d.ts.map