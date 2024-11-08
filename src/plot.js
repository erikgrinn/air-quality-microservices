
import * as Plot from "@observablehq/plot";
import { csvParse } from 'd3-dsv';

async function createChart() {
    const response = await fetch('./files/cities_air_quality_water_pollution.18-10-2021.csv');
    const text = await response.text();
    const data = csvParse(text);

    const chart = Plot.plot({
        marks: [
            Plot.barY(data, { x: "Regions", y: "AirQuality" })
        ]
    });
    document.querySelector('.header').appendChild(chart);
}

export {createChart}