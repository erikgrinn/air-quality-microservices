
import Chart from 'chart.js/auto';
import data from './files/US_AQI_Lite.csv'

function createChart() {

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


    const ctx = document.getElementById('output').getContext('2d');
    
    const labels = averageData.map(item => item.state_id); // x-axis labels
    const dataValues = averageData.map(item => item.average_AQI); // y-axis data

    const chart = new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
            labels: labels, // x-axis labels
            datasets: [{
                label: 'Average AQI by State',
                data: dataValues, // y-axis data
                backgroundColor: 'rgb(29, 111, 58, 0.75)',
                borderColor: 'rgb(29, 111, 58, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'State ID'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average AQI'
                    }
                }
            }
        }
    });

    // document.querySelector('#output').appendChild(chart); not needed using canvas with chart.js
}


export {createChart}