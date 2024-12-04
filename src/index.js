import "./styles.css";
import { createChart } from "./plot.js";
import { fetchIQAir } from "./IQAir.js";
import { getStateName, getStateAbbreviation } from "./stateConvert.js";
import { getMajorCity, getStateByCity } from "./stateCities.js";
// import getMajorCity from "./stateCities.js";
import Papa from "papaparse";



// import data from './files/US_AQI_Lite.csv';

// Parse the CSV data
// Fetch the CSV file and parse it with PapaParse
const csvFilePath = "./files/US_AQI_Lite.csv";

let parsedData = [];

const response = await fetch(csvFilePath);
const csvData = await response.text();
Papa.parse(csvData, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  complete: function (results) {
    parsedData = results.data;
  },
  error: function (error) {
    console.error("Error parsing CSV:", error);
  },
});

async function sendMicroserviceStats(data, filterState) {
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
  console.log("Received from microservice:", result);
  displayStatistics(result, filterState);
}

const statsContainer = document.getElementById("statsContainer");
statsContainer.innerHTML = `
  <h3>Filtered State Statistics: N/A</h3>
  <p>Total Count: N/A</p>
  <p>AQI Mean: N/A</p>
  <p>AQI Mode: N/A</p>
  <p>AQI Min: N/A</p>
  <p>AQI Max: N/A</p>
  <p>AQI Std: N/A</p>
`;

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

let cleanData = []; // Store parsed CSV data
let filteredData = []; // Store filtered data
const downloadOriginalBtn = document.getElementById("downloadOriginal");
const downloadFilterBtn = document.getElementById("downloadFiltered");
const cityAQIBtn = document.getElementById("cityAQI");

cleanData = parsedData.map((row) => {
  const cleanedRow = {};

  Object.keys(row).forEach((key) => {
    // Clean the key: remove surrounding quotes and any leading/trailing spaces
    const cleanKey = key
      .trim()
      .toLowerCase()
      .replace(/^"|"$/g, "")
      .replace(/\\"/g, '"');

    const value = row[key];
    const cleanValue =
      typeof value === "string"
        ? value.trim().toLowerCase().replace(/^"|"$/g, "").replace(/\\"/g, '"')
        : value;

    // Add cleaned key-value pair to the new row object
    cleanedRow[cleanKey] = cleanValue;
  });
  return cleanedRow;
});


let filterState = "";
// Filter data when the user clicks "Apply Filter"
document
  .getElementById("applyStateFilter")
  .addEventListener("click", function () {
    filterState = document
      .getElementById("filterState")
      .value.trim()
      .toLowerCase();

    let uniqueStates = [...new Set(cleanData.map((row) => row["state_id"]))]; // Get unique states

    if (filterState.length > 2 && getStateAbbreviation(filterState.toUpperCase())) {
      filterState = getStateAbbreviation(filterState.toUpperCase()).toLowerCase();
    } else if (filterState.length == 2 && uniqueStates.includes(filterState)) { // using uniqueStates to check if the state exists in limited dataset
      filterState = filterState;
    } else {
      downloadFilterBtn.disabled = true;
      cityAQIBtn.disabled = true;
      alert("Please enter a valid state or region.");
      return
    }
  
    // Filter data based on user input
    filteredData = cleanData.filter((row) => row["state_id"] === filterState);
    console.log(filteredData);
    sendMicroserviceStats(filteredData, filterState);
    downloadFilterBtn.disabled = false;
    cityAQIBtn.disabled = false;
   
  });

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

cityAQIBtn.addEventListener("click", function () {
  const majorCity = getMajorCity(filterState);
  console.log(majorCity);
})

createChart();
fetchIQAir();
