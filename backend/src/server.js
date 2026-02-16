import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initDb } from "./db.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "development-secret";
const isProduction = process.env.NODE_ENV === "production";
const allowedLeadSources = new Set(["enquire_now", "price_sheet", "brochure_download"]);

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === "development-secret")) {
  throw new Error("JWT_SECRET must be set in production.");
}

const defaultDevOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = [...new Set([...(isProduction ? [] : defaultDevOrigins), ...allowedOrigins])];
const isAllowedOrigin = (origin) => {
  // Allow non-browser clients (curl, server-to-server).
  if (!origin) return true;
  return corsOrigins.includes(origin);
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "2mb" }));

const db = await initDb();

const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "vignaharta-backend", database: db.driver });
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Vignaharta backend is running",
    health: "/api/health"
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await db.getUserByEmail(email);

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: "8h" });
  res.json({ token, email: user.email });
});

app.get("/api/auth/verify", authRequired, (req, res) => {
  res.json({ ok: true, email: req.user.email });
});

app.get("/api/content", async (req, res) => {
  const row = await db.getContent();
  if (!row) {
    res.status(500).json({ message: "Content not initialized" });
    return;
  }

  res.json(row.content);
});

app.put("/api/content", authRequired, async (req, res) => {
  const content = req.body;
  if (!content || typeof content !== "object") {
    res.status(400).json({ message: "Invalid content payload" });
    return;
  }

  await db.saveContent(content);

  res.json({ ok: true });
});

app.post("/api/leads", async (req, res) => {
  const { name, phone, email, source, notes } = req.body || {};

  if (!name || !phone || !source) {
    res.status(400).json({ message: "name, phone and source are required" });
    return;
  }

  if (!/^\d{10}$/.test(String(phone))) {
    res.status(400).json({ message: "Phone must be 10 digits" });
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  const normalizedSource = String(source).trim();
  if (!allowedLeadSources.has(normalizedSource)) {
    res.status(400).json({ message: "Invalid lead source" });
    return;
  }

  await db.createLead({
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: email ? String(email).trim() : "",
    source: normalizedSource,
    notes: notes ? String(notes).trim() : ""
  });

  res.status(201).json({ ok: true });
});

app.get("/api/leads", authRequired, async (req, res) => {
  const leads = await db.listLeads();
  res.json({ ok: true, leads });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
