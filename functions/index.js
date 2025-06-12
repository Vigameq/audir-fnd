const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

const app = express();
const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // Allow self-signed certs if needed

// ✅ CORS configuration
app.use(cors({
  origin: "https://audire-8fc86.web.app",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
}));

// ✅ POST /audire/*
app.post("/audire/*", async (req, res) => {
  try {
    const apiUrl = `https://157.245.108.44${req.url}`;
    console.log("Forwarding POST to:", apiUrl);

    const response = await axios({
      method: req.method,
      url: apiUrl,
      data: req.body,
      headers: { ...req.headers },
      httpsAgent,
      timeout: 10000,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("POST API Error:", error.toString());
    if (error.response) {
      console.error("Backend response:", error.response.status, error.response.data);
    }
    res.status(500).send({ error: "Failed to reach backend API" });
  }
});

// ✅ GET /audire/*
app.get("/audire/*", async (req, res) => {
  try {
    const apiUrl = `https://157.245.108.44${req.url}`;
    console.log("Forwarding GET to:", apiUrl);

    const response = await axios({
      method: "GET",
      url: apiUrl,
      headers: { ...req.headers },
      httpsAgent,
      timeout: 10000,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("GET API Error:", error.toString());
    if (error.response) {
      console.error("Backend response:", error.response.status, error.response.data);
    }
    res.status(500).send({ error: "Failed to reach backend API" });
  }
});

exports.api = functions.https.onRequest(app);
