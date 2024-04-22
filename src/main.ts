import { ForexData } from './data/forex-data';
import { Chart } from './chart/chart';
import { Canvas } from './chart/canvas';

const apiUrl = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false';

document.addEventListener('DOMContentLoaded', async () => {
    const chartCanvas = document.getElementById('chart-canvas') as HTMLCanvasElement;
    chartCanvas.width = 1200;
    chartCanvas.height = 600;
    const canvas = new Canvas(chartCanvas);
    canvas.renderLoader();

    const forexData = new ForexData(apiUrl);
    const data = await forexData.fetchData();

    const chart = new Chart(chartCanvas, data);
    chart.render(); 
});