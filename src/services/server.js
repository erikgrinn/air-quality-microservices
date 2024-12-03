// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const zmq = require("zeromq");

const app = express();
const port = 3000; // Node.js HTTP server port

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const sock = new zmq.Request();
sock.connect("tcp://localhost:5555"); // Python microservice port

app.post("/process", async (req, res) => {
  const message = req.body.csvData;
  await sock.send(message);

  const [result] = await sock.receive();
  res.json(JSON.parse(result.toString()));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});