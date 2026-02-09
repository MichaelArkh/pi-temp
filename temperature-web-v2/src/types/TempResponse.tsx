export interface TempResult {
    temperature: number;
    humidity: number;
    date: string;
    outdoor?: number;
}

export interface TempStats {
    average_temp: number;
    high_temp: number;
    low_temp: number;
    average_humid: number;
    high_humid: number;
    low_humid: number;
}

export interface TempResponse {
    results: TempResult[];
    stats: TempStats;
    room: string; // Added after the fact
}