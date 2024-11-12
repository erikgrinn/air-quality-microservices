import Papa from 'papaparse';
import Chart from 'chart.js/auto';
// import data from './files/US_AQI_Lite.csv'
const csvFilePath = './files/US_AQI_Lite.csv';



// Parse the CSV data
// Fetch the CSV file and parse it with PapaParse

async function createChart() {
    let parsedData = []

    const response = await fetch(csvFilePath);
    const csvData = await response.text();
    // Parse the CSV data using PapaParse
    Papa.parse(csvData, {
    header: true, // Treat the first row as headers
    dynamicTyping: true, // Automatically convert numbers, booleans, etc.
    skipEmptyLines: true, // Ignore empty lines
    complete: function(results) {
        parsedData = results.data; // The parsed CSV data
        console.log(parsedData); // Log the parsed data
        
        // You can now use `parsedData` for further processing
    },
    error: function(error) {
        console.error('Error parsing CSV:', error);
    }
    });

    // Group by state_id and calculate the average AQI
    const averageAQIByState = parsedData.reduce((acc, row) => {
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

    // * below is another way/explanation to get the averageData that was done above
    // // Create an array to hold the average AQI by state
    // const averageData = [];

    // // Loop through each state in the averageAQIByState object
    // for (const state in averageAQIByState) {
    //     const stateData = averageAQIByState[state];
    //     const averageAQI = stateData.totalAQI / stateData.count; // Calculate the average AQI

    //     // Add the result to the averageData array as a new object
    //     averageData.push({
    //         state_id: state,
    //         average_AQI: averageAQI
    //     });
    // }

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
            // maintainAspectRatio: false,  // allows resizing without maintaining the original aspect ratio
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
}


export {createChart}