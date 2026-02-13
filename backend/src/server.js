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

const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = [...new Set([...defaultOrigins, ...allowedOrigins])];
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (corsOrigins.includes(origin)) return true;
  // Allow Vercel preview/prod domains for this assignment deployment model.
  return origin.endsWith(".vercel.app");
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
  res.json({ ok: true, service: "vignaharta-backend" });
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

  const user = await db.get(
    "SELECT email, password_hash FROM admin_users WHERE email = ?",
    email
  );

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
  const row = await db.get("SELECT content_json FROM app_content WHERE id = 1");
  if (!row) {
    res.status(500).json({ message: "Content not initialized" });
    return;
  }

  res.json(JSON.parse(row.content_json));
});

app.put("/api/content", authRequired, async (req, res) => {
  const content = req.body;
  if (!content || typeof content !== "object") {
    res.status(400).json({ message: "Invalid content payload" });
    return;
  }

  await db.run(
    "UPDATE app_content SET content_json = ?, updated_at = datetime('now') WHERE id = 1",
    JSON.stringify(content)
  );

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
