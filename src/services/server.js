// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const zmq = require("zeromq");

const app = express();
const port = 3000; // Node.js HTTP server port

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const sockA = new zmq.Request();
sockA.connect("tcp://localhost:5555"); // Python microservice port

const sockB = new zmq.Request();
sockB.connect("tcp://localhost:5556"); // Python real-time data microservice port

app.post("/process", async (req, res) => {
  const message = req.body.csvData;
  await sockA.send(message);

  const [result] = await sockA.receive();
  res.json(JSON.parse(result.toString()));
});

app.post("/iqair", async (req, res) => {
  const { city, state, country } = req.body;
  const message = JSON.stringify({ city, state, country });
  await sockB.send(message);

  const [result] = await sockB.receive();
  res.json(JSON.parse(result.toString()));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});