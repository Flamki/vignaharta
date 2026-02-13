import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import { defaultContent } from "./defaultContent.js";

const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "1234";

export const initDb = async () => {
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

  return db;
};
