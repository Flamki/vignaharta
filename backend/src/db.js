import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { defaultContent } from "./defaultContent.js";

const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "1234";

const nowIso = () => new Date().toISOString();

const initSqlite = async () => {
  const dbPath = process.env.DB_PATH || "./data/app.db";
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const dbDir = path.dirname(resolvedPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = await open({
    filename: resolvedPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      source TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const existingAdmin = await db.get(
    "SELECT id FROM admin_users WHERE email = ?",
    DEFAULT_EMAIL
  );
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await db.run(
      "INSERT INTO admin_users (email, password_hash) VALUES (?, ?)",
      DEFAULT_EMAIL,
      passwordHash
    );
  }

  const existingContent = await db.get("SELECT id FROM app_content WHERE id = 1");
  if (!existingContent) {
    await db.run(
      "INSERT INTO app_content (id, content_json, updated_at) VALUES (1, ?, datetime('now'))",
      JSON.stringify(defaultContent)
    );
  }

  return {
    driver: "sqlite",
    getUserByEmail: async (email) =>
      db.get("SELECT email, password_hash FROM admin_users WHERE email = ?", email),
    getContent: async () => {
      const row = await db.get("SELECT content_json, updated_at FROM app_content WHERE id = 1");
      return row
        ? { content: JSON.parse(row.content_json), updatedAt: row.updated_at }
        : null;
    },
    saveContent: async (content) => {
      await db.run(
        "UPDATE app_content SET content_json = ?, updated_at = datetime('now') WHERE id = 1",
        JSON.stringify(content)
      );
    },
    createLead: async (lead) => {
      await db.run(
        "INSERT INTO leads (name, phone, email, source, notes, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
        lead.name,
        lead.phone,
        lead.email || null,
        lead.source,
        lead.notes || null
      );
    },
    listLeads: async () =>
      db.all(
        "SELECT id, name, phone, email, source, notes, created_at FROM leads ORDER BY id DESC LIMIT 500"
      )
    }
  };
};

const buildPgPool = () => {
  const connectionString = process.env.DATABASE_URL;
  const sslRequired = (process.env.PGSSLMODE || "").toLowerCase() === "require";
  const ssl =
    sslRequired || (connectionString && connectionString.includes("render.com"))
      ? { rejectUnauthorized: false }
      : undefined;

  return new Pool({ connectionString, ssl });
};

const initPostgres = async () => {
  const pool = buildPgPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      source TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const existingAdmin = await pool.query(
    "SELECT id FROM admin_users WHERE email = $1",
    [DEFAULT_EMAIL]
  );
  if (existingAdmin.rowCount === 0) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await pool.query(
      "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
      [DEFAULT_EMAIL, passwordHash]
    );
  }

  const existingContent = await pool.query("SELECT id FROM app_content WHERE id = 1");
  if (existingContent.rowCount === 0) {
    await pool.query(
      "INSERT INTO app_content (id, content_json, updated_at) VALUES (1, $1::jsonb, NOW())",
      [JSON.stringify(defaultContent)]
    );
  }

  return {
    driver: "postgres",
    getUserByEmail: async (email) => {
      const result = await pool.query(
        "SELECT email, password_hash FROM admin_users WHERE email = $1",
        [email]
      );
      return result.rows[0] || null;
    },
    getContent: async () => {
      const result = await pool.query(
        "SELECT content_json, updated_at FROM app_content WHERE id = 1"
      );
      if (result.rowCount === 0) return null;

      const row = result.rows[0];
      return {
        content:
          typeof row.content_json === "string"
            ? JSON.parse(row.content_json)
            : row.content_json,
        updatedAt: row.updated_at || nowIso()
      };
    },
    saveContent: async (content) => {
      await pool.query(
        "UPDATE app_content SET content_json = $1::jsonb, updated_at = NOW() WHERE id = 1",
        [JSON.stringify(content)]
      );
    },
    createLead: async (lead) => {
      await pool.query(
        "INSERT INTO leads (name, phone, email, source, notes, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
        [lead.name, lead.phone, lead.email || null, lead.source, lead.notes || null]
      );
    },
    listLeads: async () => {
      const result = await pool.query(
        "SELECT id, name, phone, email, source, notes, created_at FROM leads ORDER BY id DESC LIMIT 500"
      );
      return result.rows;
    }
  };
};

export const initDb = async () => {
  if (process.env.DATABASE_URL) {
    return initPostgres();
  }
  return initSqlite();
};
