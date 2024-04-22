import { Canvas } from './canvas';
import { ForexBar } from '../data/forex-data';

export class Chart {
    private canvas: Canvas;
    private rawData: ForexBar[];
    private xScale: number;
    private yScale: number;
    private axisLabelMargin: number = 10;
    private scrollOffset: number = 0;
    private scale: number = 1;
    private mouseX: number = 0;
    private isDragging: boolean = false;
    private viewportStartIndex: number = 0;
    private viewportEndIndex: number = 0;
    private candleWidth: number = 10; 
    private candlesInView: number; 

    constructor(canvas: HTMLCanvasElement, data: ForexBar[]) {
        this.canvas = new Canvas(canvas);
        this.rawData = data;
        this.calculateScales();
        this.updateViewport();
        this.render();
        this.canvas.element.addEventListener('wheel', this.handleZoom.bind(this), { passive: false });
        this.canvas.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    render() {
        console.log('Rendering chart...');
        this.canvas.clearCanvas();
        this.renderGrid();
        for (let i = this.viewportStartIndex; i <= this.viewportEndIndex; i++) {
            const bar = this.rawData[i];
            if (bar) {
                const x = this.calculateXPosition(i);
                const y = this.calculateYPosition(bar.close);
                const height = this.calculateBarHeight(bar.open, bar.close);
                const color = bar.close >= bar.open ? 'green' : 'red';
                const volumeHeight = (bar.tickVolume / 1000000000) * 20; 
                const volumeY = this.canvas.height - volumeHeight;
    
                this.renderVolume(x, volumeY, this.candleWidth, volumeHeight);
    
                this.canvas.drawRectangle(x, y - 10, this.candleWidth, height + 10, color);
            }
        }
        this.drawAxes();
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.isDragging) {  
            const deltaX = event.clientX - this.mouseX;
            this.mouseX = event.clientX;
            
            const dragDistance = deltaX / this.scale;
    
            this.viewportStartIndex -= Math.round(dragDistance);
            this.viewportEndIndex -= Math.round(dragDistance);
    
            this.viewportStartIndex = Math.max(0, this.viewportStartIndex);
            this.viewportEndIndex = Math.min(this.rawData.length - 1, this.viewportEndIndex);
    
            this.render();
        }
    }

    private handleMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.mouseX = event.clientX;
            this.isDragging = true;
            this.canvas.element.style.cursor = 'grabbing';
        }
    }

    private handleMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            this.isDragging = false;
            this.canvas.element.style.cursor = 'grab';
        }
    }

    private handleZoom(event: WheelEvent) {
        event.preventDefault();
        const zoomFactor = 1 + (event.deltaY > 0 ? -0.1 : 0.1);
        this.scale *= zoomFactor;
        const scrollOffsetBefore = this.scrollOffset;
        this.scrollOffset = event.clientX - ((event.clientX - this.scrollOffset) * zoomFactor);
        this.updateViewport();
        this.render();
    }

    private calculateScales() {
        const maxTime = Math.max(...this.rawData.map(bar => bar.time));
        const minPrice = Math.min(...this.rawData.map(bar => bar.low));
        const maxPrice = Math.max(...this.rawData.map(bar => bar.high));
        this.xScale = this.canvas.width / maxTime;
        this.yScale = this.canvas.height / (maxPrice - minPrice);
    }

    private calculateXPosition(index: number) {
        return (index - this.viewportStartIndex) * (this.candleWidth + 5) * this.scale;
    }

    private calculateYPosition(price: number) {
        const minPrice = Math.min(...this.rawData.map(bar => bar.low));
        return this.canvas.height - ((price - minPrice) * this.yScale);
    }

    private calculateBarHeight(open: number, close: number) {
        return Math.abs(close - open) * this.yScale;
    }

    private drawAxes() {
        const ctx = this.canvas.getContext();
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height - this.axisLabelMargin);
        ctx.lineTo(this.canvas.width, this.canvas.height - this.axisLabelMargin);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    private updateViewport() {
        this.candlesInView = Math.floor(this.canvas.width / (this.candleWidth + 5));
        const defaultCandlesInView = Math.min(this.candlesInView, this.rawData.length);
        this.viewportStartIndex = 0;
        this.viewportEndIndex = defaultCandlesInView - 1;
        this.scrollOffset = 0;
    }

    private renderGrid() {
        const ctx = this.canvas.getContext();
        const gridStepX = 50;
        const gridStepY = 50; 
    
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 0.5; 
    
        for (let x = 0; x < this.canvas.width; x += gridStepX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
    
        for (let y = 0; y < this.canvas.height; y += gridStepY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }

    private renderVolume(x: number, y: number, width: number, height: number) {
        const ctx = this.canvas.getContext();
        ctx.fillStyle = 'blue'; 
        ctx.fillRect(x, y, width, height);
    }
}
