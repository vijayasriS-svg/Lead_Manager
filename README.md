# Lead Manager — Full-Stack CRM Application

Lead Manager is a full-stack CRM web application built with **React**, **Node.js**, **Express**, and **SQLite**. It enables sales teams to capture, review, search, filter, update, and delete potential customer records with persistent SQLite storage and live pipeline summary counts.

## Features

- **Sales Dashboard**: Displays real-time totals for all leads alongside individual counts and pipeline shares for `New`, `Contacted`, `Qualified`, and `Lost` stages, plus an acquisition channel breakdown.
- **Add Lead**: Modal form with Full Name, Email, Phone Number, Company Name, Source (`Website`, `Referral`, `Social Media`, `Advertisement`, `Cold Call`, `Other`), and Status (`New`, `Contacted`, `Qualified`, `Lost`), backed by both client-side and server-side validation.
- **Responsive Leads Table**: Displays `ID`, `Name`, `Email`, `Phone`, `Company`, `Source`, `Status` badges, `Created Date`, and `Edit`/`Delete` actions on desktop, and stacked cards on narrow mobile screens.
- **Edit Lead**: Opens a pre-populated form to update any lead field, including status, and persists updates directly to SQLite.
- **Delete Lead**: Prompts with a confirmation dialog showing the lead's details before permanently deleting the record from SQLite.
- **Combined Search & Filter**: Supports searching by customer name and filtering by status simultaneously via backend query parameters, with a one-click **Clear Filters** action.
- **States & Feedback**: Includes loading skeletons, empty/no-match states, error retry views, and toast notifications for create, update, and delete actions.

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Fetch API, Lucide Icons
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: SQLite (`better-sqlite3`, stored in `leads.db` with WAL journaling and parameterized queries)
- **Testing**: Node.js built-in test runner (`node:test`) with `tsx`

## Folder Structure

```text
.
├── backend/
│   ├── controllers/
│   │   └── leadsController.ts   # REST handlers for leads CRUD and dashboard stats
│   ├── database/
│   │   └── db.ts                # SQLite schema initialization (leads.db) & parameterized queries
│   ├── middleware/
│   │   ├── errorHandler.ts      # 404 & JSON error handling middleware
│   │   └── validateLead.ts      # Server-side payload & route ID validation
│   ├── routes/
│   │   └── leadsRoutes.ts       # /api/leads and /api/dashboard route definitions
│   ├── app.ts                   # Express app factory with CORS & middleware
│   └── api.test.ts              # End-to-end API & SQLite persistence tests
├── src/
│   ├── components/
│   │   ├── DashboardSummary.tsx # KPI summary cards
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── LeadModal.tsx        # Add & Edit lead form modal
│   │   ├── LeadsTable.tsx       # Responsive data table & mobile list
│   │   ├── LeadsToolbar.tsx     # Search input, status dropdown, clear filters
│   │   ├── Sidebar.tsx          # Navigation & pipeline stage views
│   │   ├── StatusBadge.tsx      # Distinct semantic status badges
│   │   ├── ToastNotification.tsx
│   │   └── TopHeader.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── LeadsPage.tsx
│   ├── services/
│   │   └── api.ts               # Fetch API client for backend endpoints
│   ├── types/
│   │   └── lead.ts              # Shared TypeScript interfaces and enums
│   ├── utils/
│   │   ├── validation.ts        # Shared validation & date formatting utilities
│   │   └── validation.test.ts   # Unit tests for validation & formatting
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server.ts                    # Express server entry point (mounts Vite in dev, dist/ in prod)
├── .env.example                 # Environment configuration template
├── package.json
└── README.md
```

## Installation Instructions

1. Ensure **Node.js v20+** (tested on Node v22) is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and adjust values if needed:
   ```bash
   cp .env.example .env
   ```

## How to Run Frontend and Backend

### Option A: Unified Full-Stack Mode (Recommended)
Runs the Express API backend, SQLite `leads.db`, and React frontend together on a single port (`http://localhost:3000`):

```bash
npm run dev
```

For a production build:
```bash
npm run build
NODE_ENV=production npm start
```

### Option B: Separate Backend and Frontend Processes
If you prefer running the API server and Vite frontend on separate ports:

1. Start the standalone Express + SQLite backend on port `5000`:
   ```bash
   npm run dev:server
   ```
2. Set `VITE_API_BASE_URL=http://localhost:5000` in `.env`, then start the React frontend on port `5173`:
   ```bash
   npm run dev:client
   ```

## Environment Variables Configuration

No API keys or secrets are required. Every environment variable has a safe default for local development:

| Variable | Required | Default | Local Development Value | Description |
| --- | --- | --- | --- | --- |
| `PORT` | Optional | `3000` | `3000` (unified) or `5000` (standalone backend) | Port the Express server listens on. |
| `DATABASE_PATH` | Optional | `./leads.db` | `./leads.db` | File path for the SQLite database. |
| `CORS_ORIGIN` | Optional | `http://localhost:3000,http://localhost:5173` | `http://localhost:3000,http://localhost:5173` | Comma-separated allowed frontend origins. |
| `SEED_SAMPLE_DATA` | Optional | `true` | `true` or `false` | Seeds 7 sample records once when `leads.db` is first created. |
| `VITE_API_BASE_URL` | Optional | `""` (same-origin) | Leave blank for `npm run dev`; set `http://localhost:5000` for separate-server mode | Base URL for frontend API requests. |
| `STANDALONE_BACKEND` | Optional | `false` | Set automatically by `npm run dev:server` | Runs Express API only without Vite middleware. |
| `NODE_ENV` | Optional | `development` | Set `production` with `npm start` after `npm run build` | Serves static production build from `dist/`. |

## Database Details

Lead Manager creates and uses a local SQLite database file named **`leads.db`** (configurable via `DATABASE_PATH` in `.env`).

Table schema (`leads`):

| Column       | Type                                | Constraints                          |
| ------------ | ----------------------------------- | ------------------------------------ |
| `id`         | `INTEGER`                           | `PRIMARY KEY AUTOINCREMENT`          |
| `name`       | `TEXT`                              | `NOT NULL`                           |
| `email`      | `TEXT`                              | `NOT NULL`                           |
| `phone`      | `TEXT`                              | `NOT NULL`                           |
| `company`    | `TEXT`                              | `NOT NULL`                           |
| `source`     | `TEXT`                              | `NOT NULL`                           |
| `status`     | `TEXT`                              | `NOT NULL`                           |
| `created_at` | `DATETIME`                          | `DEFAULT CURRENT_TIMESTAMP`          |

- All SQL operations use **parameterized prepared statements** (`?` placeholders) via `better-sqlite3` to prevent SQL injection.
- On initial startup (when `leads.db` is brand new and `SEED_SAMPLE_DATA` is not `"false"`), 7 sample records are inserted into SQLite once and tracked in an `app_meta` table so they persist normally and are never re-inserted if you delete all leads. Set `SEED_SAMPLE_DATA=false` in `.env` to start with an empty database.

## API Endpoint Documentation

All endpoints return structured JSON responses with `{ "success": true|false, ... }`.

### `GET /api/dashboard`
Returns total lead count, counts grouped by status (`New`, `Contacted`, `Qualified`, `Lost`), source counts, and recent leads.

### `GET /api/leads`
Retrieves all leads ordered by most recent first.
- Optional query parameters:
  - `search`: Case-insensitive partial match against customer `name`.
  - `status`: Exact status filter (`New`, `Contacted`, `Qualified`, `Lost`).
- Both parameters can be combined: `GET /api/leads?search=priya&status=Qualified`.

### `GET /api/leads/:id`
Retrieves a single lead by numeric ID. Returns `400` for non-numeric IDs and `404` if not found.

### `POST /api/leads`
Creates a new lead after validating all required fields.
- Request body:
  ```json
  {
    "name": "Elena Vance",
    "email": "elena@vancelabs.io",
    "phone": "+1 (415) 555-0194",
    "company": "Vance Labs",
    "source": "Referral",
    "status": "Qualified"
  }
  ```
- Returns `201 Created` with the newly saved record, or `400 Bad Request` with field-level `errors`.

### `PUT /api/leads/:id`
Validates and updates all fields of an existing lead. Returns `200 OK` with the updated record, `400` on invalid data, or `404` if the lead does not exist.

### `DELETE /api/leads/:id`
Deletes a lead from SQLite by ID. Returns `200 OK` on success or `404` if not found.

## Running Automated Tests

```bash
npm test
```

This runs both the validation unit tests (`src/utils/validation.test.ts`) and full REST API + SQLite restart persistence integration tests (`backend/api.test.ts`).

## Assumptions

- Single-workspace CRM without multi-tenant authentication (focused on core lead CRUD, validation, search/filter, and dashboard reporting).
- Duplicate emails are permitted across leads in case the same contact submits multiple inquiries, though email addresses are normalized to lowercase.
- `created_at` timestamps are stored in UTC via SQLite's `CURRENT_TIMESTAMP` and formatted in the browser's locale.

## Future Improvements

- Pagination and multi-column sorting for very large lead datasets.
- Lead activity timeline, follow-up notes, and assigned sales rep ownership.
- CSV import and export for bulk lead onboarding and reporting.
- User authentication and role-based access control for multi-rep sales teams.
