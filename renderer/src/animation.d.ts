import { Player } from "./player";
export declare class Animation {
    private sizer;
    private canvas;
    private player;
    private loop;
    private readonly elementID;
    constructor(id: string, player: Player);
    start(): void;
    stop(): void;
    updateSize(openSiteMenu: boolean): void;
    private clear;
    private outerCircle;
    private innerCircle;
    private bars;
    private draw;
}
//# sourceMappingURL=animation.d.ts.map