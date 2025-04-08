import "./styles.css";
import { createChart } from "./plot.js";
import { getStateName, getStateAbbreviation } from "./stateConvert.js";
import { getMajorCity, getStateByCity } from "./stateCities.js";
import Papa from "papaparse";
// import { fetchIQAir } from "./IQAir.js";
// import data from './files/US_AQI_Lite.csv'; // not using because of papaparse

// Parse the CSV data
// Fetch the CSV file and parse it with PapaParse
const csvFilePath = "./files/US_AQI_Lite.csv";

let parsedData = [];
let cleanData = [];
let filteredData = [];
let filterState = "";

async function fetchCSVData() {
  const response = await fetch(csvFilePath);
  const csvData = await response.text();
  Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      parsedData = results.data;
      cleanData = parsedData.map((row) => {
        const cleanedRow = {};
        Object.keys(row).forEach((key) => {
          const cleanKey = key
            .trim()
            .toLowerCase()
            .replace(/^"|"$/g, "")
            .replace(/\\"/g, '"');
          const value = row[key];
          const cleanValue =
            typeof value === "string"
              ? value
                  .trim()
                  .toLowerCase()
                  .replace(/^"|"$/g, "")
                  .replace(/\\"/g, '"')
              : value;
          cleanedRow[cleanKey] = cleanValue;
        });
        return cleanedRow;
      });
    },
    error: function (error) {
      console.error("Error parsing CSV:", error);
    },
  });
}

async function fetchStats(data, filterState) {
  const csvString = Papa.unparse(data);
  const response = await fetch("http://localhost:3000/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ csvData: csvString }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  displayStatistics(result, filterState);
  fetchPlot(result);
}

async function fetchPlot(data) {
  const response = await fetch("http://localhost:3000/plot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plot_data: data }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  displayPlot(result.image);
}

function displayPlot(imageData) {
  const plotContainer = document.getElementById("plotContainer");
  plotContainer.innerHTML = `<img src="data:image/png;base64,${imageData}" alt="Plot Image" />`;
}

// async function fetchIQAirData(city, state, country = "USA") {
//   const response = await fetch("http://localhost:3000/iqair", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ city, state, country }),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const result = await response.json();
//   console.log(result)
//   displayIQAirData(result.data);
// }

// function displayIQAirData(data) {
//   const iqAirContainer = document.getElementById("iqAirContainer");
//   iqAirContainer.innerHTML = `
//     <h3>${data.city}, ${data.state}, ${data.country}</h3>
//     <p>AQI: ${data.current.pollution.aqius}</p>
//   `;
//   cityAQIBtn.disabled = true;
// }

function displayStatistics(stats, filterState) {
  const statsContainer = document.getElementById("statsContainer");
  statsContainer.innerHTML = `
    <h3>Filtered State Statistics: ${filterState.toUpperCase()}</h3>
    <p>Total Count: ${stats.total_count}</p>
    <p>AQI Mean: ${stats.aqi_mean}</p>
    <p>AQI Mode: ${stats.aqi_mode}</p>
    <p>AQI Min: ${stats.aqi_min}</p>
    <p>AQI Max: ${stats.aqi_max}</p>
    <p>AQI Std: ${stats.aqi_std}</p>
  `;
}

async function fetchUniqueDefiningParameters(csvData) {
  const csvString = Papa.unparse(csvData);
  const response = await fetch("http://localhost:3000/unique-defining-parameters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ csvData: csvString }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log("Unique Defining Parameters:", result.unique_defining_parameters);
  displayUniqueDefiningParameters(result.unique_defining_parameters);
}

function displayUniqueDefiningParameters(parameters) {
  const container = document.getElementById("uniqueParametersContainer");
  container.innerHTML = `
    <h3>Main Pollutant: ${filterState.toUpperCase()}</h3>
    <ul>
      ${parameters.toUpperCase()}
    </ul>
  `;
  // below for multiple params:
  // ${parameters.map(param => `<li>${param}</li>`).join('')}
}

// placing these here since inputState event listener references filter button
const inputState = document.getElementById("filterState");
const applyStateFilterBtn = document.getElementById("applyStateFilter");

inputState.addEventListener("input", function () {
  applyStateFilterBtn.disabled = false;
});

// Filter data when the user clicks "Apply Filter"
applyStateFilterBtn.addEventListener("click", function () {
  filterState = document
    .getElementById("filterState")
    .value.trim()
    .toLowerCase();

  let uniqueStates = [...new Set(cleanData.map((row) => row["state_id"]))]; // Get unique states

  if (
    filterState.length > 2 &&
    getStateAbbreviation(filterState.toUpperCase())
  ) {
    filterState = getStateAbbreviation(filterState.toUpperCase()).toLowerCase();
  } else if (filterState.length == 2 && uniqueStates.includes(filterState)) {
    // using uniqueStates to check if the state exists in limited dataset
    filterState = filterState;
  } else {
    downloadFilterBtn.disabled = true;
    // cityAQIBtn.disabled = true;
    alert("Please enter a valid state or region.");
    return;
  }

  // Filter data based on user input
  filteredData = cleanData.filter((row) => row["state_id"] === filterState);
  fetchStats(filteredData, filterState);
  fetchUniqueDefiningParameters(filteredData)
  downloadFilterBtn.disabled = false;
  // cityAQIBtn.disabled = false;
  applyStateFilterBtn.disabled = true;
});

const downloadOriginalBtn = document.getElementById("downloadOriginal");
downloadOriginalBtn.addEventListener("click", function () {
  const csv = Papa.unparse(cleanData); // Convert filtered data back to CSV format
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "original_data.csv";
  link.click();
  URL.revokeObjectURL(url); // Release memory after download
});

const downloadFilterBtn = document.getElementById("downloadFiltered");
downloadFilterBtn.addEventListener("click", function () {
  if (filteredData.length > 0) {
    const csv = Papa.unparse(filteredData); // Convert filtered data back to CSV format
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_data.csv";
    link.click();
    URL.revokeObjectURL(url); // Release memory after download

    downloadFilterBtn.disabled = true;
  } else {
    alert("No data to download.");
  }
});

// const cityAQIBtn = document.getElementById("cityAQI");
// cityAQIBtn.addEventListener("click", function () {
//   if (filterState.length == 2) {
//     let majorCity = getMajorCity(filterState);
//     let state = getStateName(filterState.toUpperCase());
//     fetchIQAirData(majorCity, state, "USA");
//   } else if (filterState.length > 2) {
//     let state = filterState;
//     let majorCity = getMajorCity(filterState);
//     fetchIQAirData(majorCity, state, "USA");
//   }
// });

fetchCSVData();
createChart();
// fetchIQAir();
