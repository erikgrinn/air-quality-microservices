# Air Quality Data Analysis and Visualization

This project provides a web application for analyzing and visualizing air quality data. The application allows users to filter air quality data by state, view statistics, display unique defining parameters, and fetch weather data for a given city and state. The project uses a combination of Node.js, Python microservices, and a frontend built with HTML, CSS, and JavaScript.

## Features

- **Filter Air Quality Data**: Filter air quality data by state and view statistics such as AQI mean, mode, min, max, and standard deviation.
- **Unique Defining Parameters**: Display the first unique defining parameter for the filtered data.
- **Weather Data**: Fetch and display current weather data for a given city and state.
- **Download Data**: Download the original and filtered air quality data as CSV files.

## Microservices

The project uses several Python microservices to handle different tasks:

1. **Statistics Microservice**:
Calculates statistics for the filtered air quality data.
2. **Plot Microservice**:
Generates a boxplot for the air quality data.
3. **Unique Defining Parameter Microservice**: Retrieves the first unique defining parameter for the filtered data.

## Installation

1. **Clone the repository**:

```sh
   git clone https://github.com/erikgrinn/mainproject.git
   cd main_project
```
2. **Install Node.js dependencies**:
```sh
   npm install
```
3. **Install Python dependencies**:
```sh
   pip install zmq pandas requests matplotlib
```
<!-- 4. **Set up environment variables**:
```sh
   IQAIR_API_KEY=your_iqair_api_key
``` -->

## Usage

1. **Visit the deployed site or start the webpack server**:
```sh
    npm start
```

2. **Start the ZeroMQ server**:
```sh
    node src/services/server.js
```

3. **Run the Python microservices**:
- Statistics Microservice
```sh
    python src/services/microservice_statistics.py
```

<!-- - IQAir Data Microservice
```sh
    python src/services/microservice_iqair.py
``` -->

- Plot Microservice
```sh
    python src/services/microservice_boxplot.py
```

- Unique Defining Parameter Microservice
```sh
    python src/services/microservice_d.py
```

4. **Open the web application**:

Visit the deployed link or open your web browser and navigate to http://localhost:8080

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.