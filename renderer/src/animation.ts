import {Player} from "./player";

export class Animation {
    private sizer: number;
    private canvas: HTMLElement;
    private player: Player;
    private loop: boolean;
    private readonly elementID: string;

    public constructor(id: string, player: Player) {
        this.elementID = id;
        this.canvas = <HTMLElement>document.getElementById(id);
        this.player = player;
        this.loop = false;
        this.sizer = 1.5;
    }

    public start(): void {
        this.loop = true;
        this.draw();
    }

    public stop(): void {
        this.loop = false;
        this.clear();
    }

    public updateSize(): void {
        // @ts-ignore
        this.canvas.height = window.innerHeight - 180;
        // @ts-ignore
        this.canvas.width = window.innerWidth - 240;
    }

    private clear() {
        // @ts-ignore
        let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.canvas.getContext("2d");

        // @ts-ignore
        const centerX: number = this.canvas.width / 2;
        // @ts-ignore
        const centerY: number = this.canvas.height / 2;

        // @ts-ignore
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        this.outerCircle(ctx, centerX, centerY);
        this.innerCircle(ctx, centerX, centerY);
    }

    private outerCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
        let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 + 10 + 255 / this.sizer);
        gradient.addColorStop(1, "rgba(0,0,0)");
        gradient.addColorStop(0.1, "#ffffff");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        // @ts-ignore
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fill();
    }

    private innerCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
        let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 - 5);
        gradient.addColorStop(1, "rgba(163,0,252,0.5)");
        gradient.addColorStop(0.5, "#ffffff");

        ctx.beginPath();
        ctx.fillStyle = gradient
        ctx.arc(centerX, centerY, 100 - 5, 0, Math.PI * 2);
        ctx.fill();
    }

    private bars(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
        let frequency_array: Uint8Array = this.player.getFrequency();
        let alpha: number = 0;
        let x1: number;
        let x2: number;
        let y1: number;
        let y2: number;

        for (let i = 0; i < 360; i++) {
            x1 = Math.cos(alpha) * 100;
            x2 = Math.cos(alpha) * (100 + frequency_array[i] /this.sizer);
            y1 = Math.sin(alpha) * 100;
            y2 = Math.sin(alpha) * (100 + frequency_array[i] / this.sizer);

            x1 += centerX;
            x2 += centerX;
            y1 += centerY;
            y2 += centerY;

            ctx.beginPath();

            let gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0.1, "rgba(163,0,252,0.5)");
            gradient.addColorStop(1, "#ffffff");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 4;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            alpha = alpha + 8
        }
    }

    private draw(): void {
        try {
            this.canvas = <HTMLElement>document.getElementById(this.elementID);
            // @ts-ignore
            let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.canvas.getContext("2d");

            // @ts-ignore
            const centerX: number = this.canvas.width / 2;
            // @ts-ignore
            const centerY: number = this.canvas.height / 2;

            // @ts-ignore
            ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

            this.outerCircle(ctx, centerX, centerY);
            this.innerCircle(ctx, centerX, centerY);
            this.bars(ctx, centerX, centerY);

            if (this.loop) {
                window.requestAnimationFrame(() => this.draw());
            }
        } catch {
            if (this.loop) {
                window.requestAnimationFrame(() => this.draw());
            }
        }
    }

}
