const functions = require("firebase-functions");
const { defineString } = require("firebase-functions/params");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const DO_SPACES_KEY = defineString("DO_SPACES_KEY");
const DO_SPACES_SECRET = defineString("DO_SPACES_SECRET");
const DO_SPACES_REGION = defineString("DO_SPACES_REGION");
const DO_SPACES_BUCKET = defineString("DO_SPACES_BUCKET");
const DO_SPACES_ENDPOINT = defineString("DO_SPACES_ENDPOINT");

const app = express();
const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // Allow self-signed certs if needed


function normalizeSpacesEndpoint(endpoint, bucket) {
  if (!endpoint) return endpoint;
  try {
    const url = new URL(endpoint);
    if (bucket && url.hostname.startsWith(bucket + '.')) {
      url.hostname = url.hostname.slice(bucket.length + 1);
    }
    return url.toString().replace(/\/$/, '');
  } catch (error) {
    return endpoint;
  }
}

function getSpacesConfig() {
  const endpointRaw = DO_SPACES_ENDPOINT.value();
  const region = (DO_SPACES_REGION.value() || '').toLowerCase();
  const bucket = DO_SPACES_BUCKET.value();
  const accessKeyId = DO_SPACES_KEY.value();
  const secretAccessKey = DO_SPACES_SECRET.value();
  const endpoint = normalizeSpacesEndpoint(endpointRaw, bucket);
  return { endpoint, region, bucket, accessKeyId, secretAccessKey };
}

function createSpacesClient() {
  const { endpoint, region, accessKeyId, secretAccessKey } = getSpacesConfig();
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true
  });
}

async function buildSignedUrl(key) {
  const cfg = getSpacesConfig();
  const client = createSpacesClient();
  if (!client) return null;
  const command = new GetObjectCommand({ Bucket: cfg.bucket, Key: key });
  return await getSignedUrl(client, command, { expiresIn: 300 });
}

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


// ✅ Signed URL for evidence files (DO Spaces)
app.get("/audire/api/questionDataFile/:auditId/:fileName", async (req, res) => {
  try {
    const { auditId, fileName } = req.params;
    const overrideKey = req.query.key;
    const key = overrideKey || `${auditId}/${fileName}`;
    const signedUrl = await buildSignedUrl(key);
    if (!signedUrl) {
      return res.status(500).send({ error: "Spaces configuration missing" });
    }
    res.set("Cache-Control", "no-store");
    return res.redirect(302, signedUrl);
  } catch (error) {
    console.error("Signed URL error (questionDataFile):", error.toString());
    return res.status(500).send({ error: "Failed to generate signed URL" });
  }
});

app.get("/audire/api/questionNCDataFile/:auditId/:responseType/:fileName", async (req, res) => {
  try {
    const { auditId, responseType, fileName } = req.params;
    const overrideKey = req.query.key;
    const key = overrideKey || `${auditId}/${responseType}/${fileName}`;
    const signedUrl = await buildSignedUrl(key);
    if (!signedUrl) {
      return res.status(500).send({ error: "Spaces configuration missing" });
    }
    res.set("Cache-Control", "no-store");
    return res.redirect(302, signedUrl);
  } catch (error) {
    console.error("Signed URL error (questionNCDataFile):", error.toString());
    return res.status(500).send({ error: "Failed to generate signed URL" });
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
