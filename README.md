<div align="center">
  <h1>Vignaharta Real Estate Website</h1>
  <p><strong>Assignment Implementation: Frontend + Backend + Database + Admin CMS</strong></p>
  <p>
    <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white" />
    <img alt="Backend" src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-000000?logo=express&logoColor=white" />
    <img alt="Database" src="https://img.shields.io/badge/Database-PostgreSQL%20(Prod)%20%2B%20SQLite%20(Local)-336791?logo=postgresql&logoColor=white" />
    <img alt="Auth" src="https://img.shields.io/badge/Auth-Credential%20Login%20%2B%20JWT-6DB33F" />
  </p>
</div>

---

## 1. Project Overview

This project is a complete full-stack implementation of the assignment:

- Exact-style **real-estate landing website**
- Functional **admin panel** for dynamic text updates
- **Backend API** for authentication and content management
- **PostgreSQL (production)** and **SQLite (local fallback)**
- Ready for split deployment:
  - Frontend on **Vercel**
  - Backend on **Render/Railway/Cyclic**

The website content shown on the home page is fetched from backend APIs. Admin edits persist in PostgreSQL (if `DATABASE_URL` is set) or SQLite fallback.

---

## 2. Assignment Compliance Matrix

<table>
  <thead>
    <tr>
      <th>Assignment Requirement</th>
      <th>Status</th>
      <th>Implementation Detail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>React frontend</td>
      <td>Done</td>
      <td>Vite + React app in project root</td>
    </tr>
    <tr>
      <td>Node.js + Express backend</td>
      <td>Done</td>
      <td><code>backend/src/server.js</code></td>
    </tr>
    <tr>
      <td>Database integration</td>
      <td>Done</td>
      <td>PostgreSQL in production, SQLite fallback in local/dev</td>
    </tr>
    <tr>
      <td>Admin login (fixed credentials)</td>
      <td>Done</td>
      <td><code>admin@gmail.com / 1234</code>, validated on backend</td>
    </tr>
    <tr>
      <td>Edit text in all required sections</td>
      <td>Done</td>
      <td>Hero, Overview, Amenities, Connectivity, Developer/Updates, FAQ</td>
    </tr>
    <tr>
      <td>Images static</td>
      <td>Done</td>
      <td>Image URLs remain static; text content is CMS-managed</td>
    </tr>
    <tr>
      <td>Public hosting (frontend + backend separate)</td>
      <td>Ready</td>
      <td>Deployment instructions included below</td>
    </tr>
  </tbody>
</table>

---

## 3. Architecture

```text
┌──────────────────────────────┐
│ Frontend (React + Vite)      │
│ - Home page                  │
│ - Admin panel                │
│ - Calls backend REST API     │
└──────────────┬───────────────┘
               │ HTTP (JSON)
┌──────────────▼───────────────┐
│ Backend (Node + Express)     │
│ - Auth endpoints             │
│ - Content read/write APIs    │
│ - JWT token verification     │
└──────────────┬───────────────┘
               │ SQL
┌──────────────▼───────────────┐
│ SQLite                        │
│ - admin_users                 │
│ - app_content                 │
└──────────────────────────────┘
```

---

## 4. Tech Stack

### Frontend
- React 19
- TypeScript
- React Router
- Vite

### Backend
- Node.js
- Express.js
- sqlite + sqlite3
- bcryptjs (password hash)
- jsonwebtoken (auth token)
- cors

### Database
- SQLite (single-file local DB)

---

## 5. Folder Structure

```text
vignaharta/
├─ components/
├─ pages/
│  ├─ Home.tsx
│  └─ Admin.tsx
├─ services/
│  └─ contentService.ts
├─ constants.ts
├─ types.ts
├─ vite.config.ts
├─ .env.local
├─ backend/
│  ├─ src/
│  │  ├─ server.js
│  │  ├─ db.js
│  │  └─ defaultContent.js
│  ├─ data/
│  │  └─ app.db
│  ├─ .env
│  ├─ .env.example
│  └─ package.json
└─ README.md
```

---

## 6. Core Functional Flow

### Public Site Flow
1. Home page loads
2. Frontend calls `GET /api/content`
3. Backend reads JSON from SQLite
4. Frontend renders sections from DB content

### Admin Flow
1. Admin visits `/#/admin`
2. Login with fixed credentials
3. Backend validates credentials (`POST /api/auth/login`)
4. Backend returns JWT token
5. Admin edits content
6. Save triggers `PUT /api/content` with token
7. Backend updates SQLite JSON payload
8. Reloading frontend shows persisted data

---

## 7. Database Design

### Table: `admin_users`
- `id` (INTEGER, PK)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)

### Table: `app_content`
- `id` (INTEGER, PK, fixed value = 1)
- `content_json` (TEXT, complete CMS JSON)
- `updated_at` (TEXT datetime)

### Table: `leads`
- `id` (PK)
- `name`
- `phone`
- `email`
- `source` (`enquire_now`, `price_sheet`, `brochure_download`)
- `notes`
- `created_at`

### Why JSON in one row?
- Easy for assignment-level CMS
- Entire content model can be updated atomically
- Simple API contract between frontend and backend

---

## 8. API Documentation

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Route</th>
      <th>Purpose</th>
      <th>Auth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GET</td>
      <td><code>/</code></td>
      <td>Backend root status</td>
      <td>No</td>
    </tr>
    <tr>
      <td>GET</td>
      <td><code>/api/health</code></td>
      <td>Health check</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td><code>/api/auth/login</code></td>
      <td>Admin login</td>
      <td>No</td>
    </tr>
    <tr>
      <td>GET</td>
      <td><code>/api/auth/verify</code></td>
      <td>Token verification</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>GET</td>
      <td><code>/api/content</code></td>
      <td>Read website content</td>
      <td>No</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td><code>/api/content</code></td>
      <td>Save updated content</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>POST</td>
      <td><code>/api/leads</code></td>
      <td>Capture website enquiry/download leads</td>
      <td>No</td>
    </tr>
  </tbody>
</table>

---

## 9. Admin Credentials

```text
Email: admin@gmail.com
Password: 1234
```

Credentials are validated by backend and not by frontend hardcode checks.

---

## 10. Environment Variables

### Frontend (`.env.local`)

```env
VITE_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)

```env
PORT=4000
DB_PATH=./data/app.db
DATABASE_URL=
PGSSLMODE=require
JWT_SECRET=dev-secret-change-in-production
FRONTEND_URLS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
```

DB selection logic:
- If `DATABASE_URL` is present -> backend uses PostgreSQL.
- If `DATABASE_URL` is empty -> backend uses SQLite at `DB_PATH`.

---

## 11. Local Development Setup

### Prerequisites
- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
cd backend && npm install
```

PowerShell alternative:

```powershell
npm install
cd backend
npm install
```

### Run Backend

```powershell
cd backend
npm run dev
```

### Run Frontend (new terminal)

```powershell
npm run dev
```

### Access URLs
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3000/#/admin`
- Backend root: `http://localhost:4000/`
- Backend health: `http://localhost:4000/api/health`

---

## 12. Verify Data is Really Stored in DB

Run this command from project root:

```powershell
@'
import sqlite3, json
conn = sqlite3.connect(r'backend/data/app.db')
cur = conn.cursor()
cur.execute("SELECT id, updated_at, length(content_json) FROM app_content")
print(cur.fetchall())
cur.execute("SELECT content_json FROM app_content WHERE id=1")
obj = json.loads(cur.fetchone()[0])
print(obj["hero"]["projectName"])
conn.close()
'@ | python -
```

How to confirm persistence:
1. Change content in admin panel
2. Click **Save Changes**
3. Re-run command above
4. `updated_at` changes and edited value appears

---

## 13. Deployment Guide (Frontend + Backend Separate)

## 13.1 Backend on Render / Railway

Use `backend/` as the service root.

### Build/Start
- Build Command: `npm install`
- Start Command: `npm start`

### Environment Variables
- `PORT=4000` (or platform-provided)
- `DATABASE_URL=<Render Postgres External Database URL>`
- `PGSSLMODE=require`
- `JWT_SECRET=<strong-random-secret>`
- `FRONTEND_URLS=https://<your-vercel-domain>`

Optional fallback:
- `DB_PATH=./data/app.db` (used only when `DATABASE_URL` is not set)

### Output
- Get backend live URL, example:
  - `https://your-backend.onrender.com`

## 13.2 Frontend on Vercel

Use repository root as project root.

### Environment Variable
- `VITE_API_URL=https://your-backend.onrender.com`

### Output
- Frontend live URL, example:
  - `https://your-project.vercel.app`

---

## 14. Post-Deployment Validation Checklist

1. Open frontend live URL
2. Open admin route (`/#/admin`)
3. Login with fixed credentials
4. Edit one text field and click save
5. Refresh page and confirm value persists
6. Call backend `/api/content` and confirm new value exists

---

## 15. Security Notes

- Password is hashed in DB using `bcryptjs`
- Content write endpoint is protected with JWT
- CORS restricted to allowed frontend origins
- For production, replace `JWT_SECRET` with strong random value

---

## 16. Known Scope Boundaries

- Image CMS upload/edit is intentionally not implemented (assignment says static images are acceptable)
- No role-based multi-user admin (single fixed admin as required)
- No advanced editor/versioning (not required in assignment)
- If deployed on Render free web service with SQLite file storage (`./data/app.db`), data can be ephemeral across redeploys/restarts. This is acceptable for assignment demo purposes; managed DB is recommended for production persistence.

---

## 17. Quick Submission Template

Copy this section while submitting:

```text
GitHub Repository: <add your repo link>
Frontend Live URL (Vercel): <add your frontend URL>
Backend Live URL (Render/Railway): <add your backend URL>
Admin Credentials: admin@gmail.com / 1234
```

---

## 18. Important File References

- Frontend entry: `index.tsx`
- Routing: `App.tsx`
- Home page: `pages/Home.tsx`
- Admin panel: `pages/Admin.tsx`
- Frontend API service: `services/contentService.ts`
- Backend server: `backend/src/server.js`
- DB init/seed: `backend/src/db.js`
- Default content seed: `backend/src/defaultContent.js`

---

<div align="center">
  <p><strong>Project is fully aligned with assignment requirements and ready for live deployment submission.</strong></p>
</div>
