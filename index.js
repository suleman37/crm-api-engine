const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./Config/DB");
const employeeRoutes = require("./Routes/add_employee");
const { exec } = require("child_process");
require("dotenv").config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", employeeRoutes);

let currentSSID = "";
const requiredSSID = process.env.SSID;
let server;

const startServer = () => {
  const PORT = 4000;
  server = app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
  });
};

const stopServer = () => {
  if (server) {
    server.close(() => {
      console.log("Server stopped.");
    });
  }
};

const checkNetworkAndRestart = () => {
  exec("iwgetid -r", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error getting SSID: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    const ssid = stdout.trim();
    if (ssid !== currentSSID) {
      currentSSID = ssid;
      console.log(`Connected to SSID: ${ssid}`);

      if (ssid === requiredSSID) {
        stopServer();
        startServer();
      } else {
        console.error(`Server can only run on ${requiredSSID} network.`);
        stopServer();
      }
    }
  });
};

setInterval(checkNetworkAndRestart, 5000);