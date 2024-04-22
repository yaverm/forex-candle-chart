interface ForexBar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    tickVolume: number;
}

class ForexData {
    constructor(private apiUrl: string) {}

    async fetchData(): Promise<ForexBar[]> {
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return this.parseData(data);
    }

    private parseData(data: any): ForexBar[] {
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid data format');
        }
    
        let bars: ForexBar[] = [];
        data.forEach((chunk: any) => {
            if (chunk.Bars && Array.isArray(chunk.Bars)) {
                bars = bars.concat(chunk.Bars
                    .filter((bar: any) => bar.TickVolume > 0)
                    .map((bar: any) => ({
                        time: chunk.ChunkStart + bar.Time,
                        open: bar.Open,
                        high: bar.High,
                        low: bar.Low,
                        close: bar.Close,
                        tickVolume: bar.TickVolume
                    }))
                );  
            }
        });
    
        return bars;
    }
}

export { ForexData, ForexBar };