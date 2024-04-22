export class Canvas {
    private context: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    public element: HTMLCanvasElement;

    constructor(private canvas: HTMLCanvasElement) {
        this.element = canvas;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            this.context = ctx;
        } else {
            throw new Error('Unable to get 2D context for canvas');
        }
        this.width = canvas.width;
        this.height = canvas.height;
    }   

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawRectangle(x: number, y: number, width: number, height: number, color: string) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    renderLoader() {
        const ctx = this.getContext();
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading data...', this.width / 2, this.height / 2);
    }


    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }
}