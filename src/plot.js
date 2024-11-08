
import * as Plot from "@observablehq/plot";
// import { csvParse } from 'd3-dsv';
import data from './files/US_AQI_Lite.csv'

function createChart() {
    // const response = await fetch('./files/US_AQI_Lite.csv');
    // const text = await response.text();
    // const data = csvParse(text);
    console.log(data)
    console.log(typeof data[1].density)

    // const cleanData = data.map(row => {
    //     row.density = parseInt(row.density); 
    //     row.AQI = parseInt(row.AQI)
    //     return row;
    // });
    console.log(data);
    console.log(data[1].density)


    // Group by state_id and calculate the average AQI
    const averageAQIByState = data.reduce((acc, row) => {
        const state = row.state_id;
        const aqi = row.AQI;

        // Initialize the state if it doesn't exist in the accumulator
        if (!acc[state]) {
            acc[state] = { totalAQI: 0, count: 0 };
        }

        // Accumulate AQI values and count
        acc[state].totalAQI += aqi;
        acc[state].count += 1;

        return acc;
    }, {});

    // Now calculate the average AQI for each state
    const averageData = Object.keys(averageAQIByState).map(state => {
        const { totalAQI, count } = averageAQIByState[state];
        return {
            state_id: state,
            average_AQI: totalAQI / count  // Calculate average
        };
    });



        const chart = Plot.plot({
        marks: [
            Plot.barY(averageData, { x: "state_id", y: "average_AQI" })
        ]
    });

    // const chart = Plot.plot({
    //     marks: [
    //         Plot.barY(data, { x: "state_id", y: averageData })
    //     ]
    // });
    document.querySelector('#output').appendChild(chart);
}


export {createChart}