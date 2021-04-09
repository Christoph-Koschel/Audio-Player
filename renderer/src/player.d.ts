export declare class Player {
    private playlist;
    private playIndex;
    private player;
    private readonly eventList;
    private loop;
    private information;
    private volume;
    constructor();
    playIndexUp(): void;
    playIndexDown(): void;
    pushPlaylist(item: string): void;
    setPlaylist(items: string[]): void;
    play(): void;
    resume(): void;
    pause(): void;
    isPlaying(): boolean;
    setIndex(index: number): void;
    setVolume(volume: number): void;
    getVolume(): number;
    on(event: "play" | "stop" | "timeChange" | "end" | "information", callback: {
        (): void;
    }): void;
    getTimeData(type: "duration" | "current"): string;
    getBarData(): number;
    getPlaylist(): string[];
    getPlayIndex(): number;
    getLastInformation(): string;
    unLoad(): void;
    private isUrl;
    private clearInformation;
    private emit;
    private load;
    private loadYoutubeVideo;
}
//# sourceMappingURL=player.d.ts.map