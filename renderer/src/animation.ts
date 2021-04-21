import {Player} from "./player";

export class Animation {
    private canvas: HTMLElement;
    private player: Player;
    private ctx: CanvasRenderingContext2D;
    private loop: boolean;

    public constructor(canvas: HTMLElement, player: Player) {
        this.canvas = canvas;
        this.player = player;
        this.loop = false;
        // @ts-ignore
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    }

    public start(): void {
        this.loop = true;
        this.draw();
    }

    public stop(): void {
        this.loop = false;
    }

    private draw(): void {
        // @ts-ignore
        this.canvas.height = window.innerHeight - 90;
        // @ts-ignore
        this.canvas.width = window.innerWidth - 200;

        // @ts-ignore
        const centerX: number = this.canvas.width / 2;
        // @ts-ignore
        const centerY: number = this.canvas.height / 2;

        window.requestAnimationFrame(this.draw);
    }

}
