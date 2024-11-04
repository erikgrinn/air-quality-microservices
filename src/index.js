import './styles.css';
import Papa from 'papaparse';

let parsedData = []; // Store parsed CSV data
let filteredData = []; // Store filtered data

// Parse CSV file when user uploads it
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // parsedData = results.data
                parsedData = results.data.map(row=> {
                    Object.keys(row).forEach(key=> {
                        row[key] = row[key].trim().replace(/^"|"$/g, '').replace(/\\"/g, '"');
                    })
                    return row
                }); // Store parsed data globally
                console.log(parsedData.slice(0,10))
            },
            error: function(error) {
                console.error('Error parsing CSV:', error.message);
            }
        });
    } else {
        console.error("No file selected");
    }
});

// Assuming parsedData is an array of objects, where each object represents a row from the CSV


// Filter data when the user clicks "Apply Filter"
document.getElementById('applyFilter').addEventListener('click', function() {
    const filterState = document.getElementById('filterState').value.trim();
    console.log(filterState)

    let uniqueStates = [...new Set(parsedData.map(row => row["Region"]))]; // Get unique states

    if (filterState && uniqueStates.includes(filterState)) {
        // Filter data based on user input
        filteredData = parsedData.filter(row => row["Region"] === filterState);
        
        document.getElementById('downloadFiltered').style.display = 'block'; // Show download button
    } else {
        alert('Please enter a valid state.');
    }
});


document.getElementById('downloadFiltered').addEventListener('click', function() {
    if (filteredData.length > 0) {
        const csv = Papa.unparse(filteredData); // Convert filtered data back to CSV format
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filtered_data.csv';
        link.click();
        URL.revokeObjectURL(url); // Release memory after download
    } else {
        alert('No data to download.');
    }
});
