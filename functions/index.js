const functions = require("firebase-functions");
const { defineString } = require("firebase-functions/params");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");
const { Pool } = require("pg");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const DO_SPACES_KEY = defineString("DO_SPACES_KEY");
const DO_SPACES_SECRET = defineString("DO_SPACES_SECRET");
const DO_SPACES_REGION = defineString("DO_SPACES_REGION");
const DO_SPACES_BUCKET = defineString("DO_SPACES_BUCKET");
const DO_SPACES_ENDPOINT = defineString("DO_SPACES_ENDPOINT");

const DB_USER = defineString("DB_USER");
const DB_PASSWORD = defineString("DB_PASSWORD");
const DB_HOST = defineString("DB_HOST");
const DB_PORT = defineString("DB_PORT");
const DB_NAME = defineString("DB_NAME");
const DB_SSLMODE = defineString("DB_SSLMODE");

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

function getDbConfig() {
  const user = DB_USER.value() || process.env.DB_USER;
  const password = DB_PASSWORD.value() || process.env.DB_PASSWORD;
  const host = DB_HOST.value() || process.env.DB_HOST;
  const port = DB_PORT.value() || process.env.DB_PORT;
  const database = DB_NAME.value() || process.env.DB_NAME;
  const sslmode = (DB_SSLMODE.value() || process.env.DB_SSLMODE || '').toLowerCase();
  return { user, password, host, port, database, sslmode };
}

function getDbPool() {
  const cfg = getDbConfig();
  if (!cfg.user || !cfg.password || !cfg.host || !cfg.port || !cfg.database) {
    return null;
  }
  return new Pool({
    user: cfg.user,
    password: cfg.password,
    host: cfg.host,
    port: Number(cfg.port),
    database: cfg.database,
    ssl: cfg.sslmode === 'require' ? { rejectUnauthorized: false } : undefined
  });
}

async function queryDb(sql, params = []) {
  const pool = getDbPool();
  if (!pool) throw new Error('DB config not set');
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result;
  } finally {
    client.release();
    await pool.end();
  }
}

async function ensureAuditQuestionsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS audir_audit_questions (
      id SERIAL PRIMARY KEY,
      audit_id INTEGER NOT NULL,
      template VARCHAR(255),
      template_type VARCHAR(255),
      original_question TEXT,
      question TEXT NOT NULL,
      action VARCHAR(20) NOT NULL,
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await queryDb(sql);
}

async function buildSignedUrl(key) {
  const cfg = getSpacesConfig();
  const client = createSpacesClient();
  if (!client) return null;
  const command = new GetObjectCommand({ Bucket: cfg.bucket, Key: key });
  return await getSignedUrl(client, command, { expiresIn: 300 });
}


async function proxyEvidenceFromBackend(req, res) {
  const apiUrl = `https://157.245.108.44${req.url}`;
  try {
    const response = await axios({
      method: "GET",
      url: apiUrl,
      headers: { ...req.headers },
      responseType: "arraybuffer",
      httpsAgent,
      timeout: 10000,
    });

    const fileName = req.params?.fileName || '';
    const lower = fileName.toLowerCase();
    let contentType = response.headers["content-type"] || "application/octet-stream";
    if (!response.headers["content-type"]) {
      if (lower.endsWith('.pdf')) contentType = 'application/pdf';
      else if (lower.endsWith('.png')) contentType = 'image/png';
      else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) contentType = 'image/jpeg';
    }

    res.set("Cache-Control", "no-store");
    res.set("Content-Type", contentType);
    if (fileName) {
      res.set("Content-Disposition", `inline; filename="${fileName}"`);
    }

    return res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Backend proxy error:", error.toString());
    if (error.response) {
      return res.status(error.response.status).send(error.response.data);
    }
    return res.status(500).send({ error: "Failed to proxy evidence" });
  }
}

// ✅ CORS configuration
app.use(cors({
  origin: "https://audire-8fc86.web.app",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
}));

// ✅ Audit list (all) from DB
app.post("/audire/api/listAllAudits", async (req, res) => {
  try {
    const email = (req.body?.eMail || '').toLowerCase();
    if (!email) return res.status(400).send({ message: 'Email is required' });
    const sql = `
      SELECT id, link_audit, audit_title, functions, template, function_template,
             start_date, end_date, auditors, auditees, city, country, audit_scope, audit_type, audit_status, email
      FROM audir_audit
      WHERE email IN (
        SELECT email FROM audir_users
        WHERE organisation = (
          SELECT organisation FROM audir_users WHERE email = $1 LIMIT 1
        )
      );
    `;
    const result = await queryDb(sql, [email]);
    res.status(200).send({ audit_data: result.rows });
  } catch (error) {
    console.error('listAllAudits error:', error.toString());
    res.status(500).send({ error: 'Failed to fetch audits' });
  }
});

// ✅ Audit question overrides (add/edit/delete)
app.post("/audire/api/listAuditQuestionOverrides", async (req, res) => {
  try {
    const auditId = req.body?.audit_id;
    if (!auditId) return res.status(400).send({ message: 'audit_id is required' });
    await ensureAuditQuestionsTable();
    const sql = `SELECT id, audit_id, template, template_type, original_question, question, action, created_by, created_at, updated_at
                 FROM audir_audit_questions WHERE audit_id = $1 ORDER BY id ASC`;
    const result = await queryDb(sql, [auditId]);
    res.status(200).send({ overrides: result.rows });
  } catch (error) {
    console.error('listAuditQuestionOverrides error:', error.toString());
    res.status(500).send({ error: 'Failed to fetch overrides' });
  }
});

app.post("/audire/api/addAuditQuestion", async (req, res) => {
  try {
    const { audit_id, template, template_type, original_question, question, created_by } = req.body || {};
    if (!audit_id || !question) return res.status(400).send({ message: 'audit_id and question are required' });
    await ensureAuditQuestionsTable();
    const sql = `INSERT INTO audir_audit_questions (audit_id, template, template_type, original_question, question, action, created_by)
                 VALUES ($1, $2, $3, $4, $5, 'add', $6) RETURNING id`;
    const result = await queryDb(sql, [audit_id, template, template_type, original_question, question, created_by]);
    res.status(200).send({ message: 'Audit question added', id: result.rows[0]?.id });
  } catch (error) {
    console.error('addAuditQuestion error:', error.toString());
    res.status(500).send({ error: 'Failed to add audit question' });
  }
});

app.post("/audire/api/updateAuditQuestion", async (req, res) => {
  try {
    const { id, question, updated_by } = req.body || {};
    if (!id || !question) return res.status(400).send({ message: 'id and question are required' });
    await ensureAuditQuestionsTable();
    const sql = `UPDATE audir_audit_questions SET question = $1, action = 'edit', updated_at = NOW() WHERE id = $2`;
    await queryDb(sql, [question, id]);
    res.status(200).send({ message: 'Audit question updated', id });
  } catch (error) {
    console.error('updateAuditQuestion error:', error.toString());
    res.status(500).send({ error: 'Failed to update audit question' });
  }
});

app.post("/audire/api/deleteAuditQuestion", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).send({ message: 'id is required' });
    await ensureAuditQuestionsTable();
    const sql = `UPDATE audir_audit_questions SET action = 'delete', updated_at = NOW() WHERE id = $1`;
    await queryDb(sql, [id]);
    res.status(200).send({ message: 'Audit question deleted' });
  } catch (error) {
    console.error('deleteAuditQuestion error:', error.toString());
    res.status(500).send({ error: 'Failed to delete audit question' });
  }
});

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
    if (signedUrl) {
      try {
        await axios({ method: "HEAD", url: signedUrl, timeout: 5000 });
        res.set("Cache-Control", "no-store");
        return res.redirect(302, signedUrl);
      } catch (headError) {
        // fall through to backend proxy
      }
    }
    return proxyEvidenceFromBackend(req, res);
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
    if (signedUrl) {
      try {
        await axios({ method: "HEAD", url: signedUrl, timeout: 5000 });
        res.set("Cache-Control", "no-store");
        return res.redirect(302, signedUrl);
      } catch (headError) {
        // fall through to backend proxy
      }
    }
    return proxyEvidenceFromBackend(req, res);
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
