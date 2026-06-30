export interface WeatherData {
    name: string;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };
    weather: {
        description: string;
    }[];
    wind: {
        speed: number;
    };
}
export interface ForecastData {
    list: {
        dt_txt: string;
        main: {
            temp: number;
        };
        weather: {
            main: string;
            description: string;
            icon: string;
        }[];
    }[];
}
//# sourceMappingURL=types.d.ts.map