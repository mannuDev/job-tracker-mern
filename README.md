# Jobwise: Job Application Tracker (MERN)

A full-stack web app for tracking job applications from first submit to offer. Users create an account, add applications, move them through stages, and see their whole search at a glance.

## Key features

- Register and log in with JWT stored in an **httpOnly cookie**; passwords hashed with bcrypt
- Create, read, update and delete applications (company, role, status, date, location, link, notes)
- Every user sees **only their own data**; all queries are scoped to the logged-in user
- Pipeline bar showing the share of applications in each stage; click a stage to filter
- Search by company or role, filter by status, sort by date or company
- List view and drag-and-drop **Board** view (Applied, Interview, Offer, Rejected)
- Server-side validation with field-level error messages, plus client-side checks
- Responsive layout (desktop, tablet, phone), keyboard accessible, light and dark mode
- Security basics: helmet, CORS restricted to the client, rate-limited auth routes, request size limit, centralized error handling

## Technologies used

| Layer | Stack |
| --- | --- |
| Database | MongoDB with Mongoose |
| Backend | Node.js, Express 4, jsonwebtoken, bcryptjs, express-validator, helmet, cors, cookie-parser, express-rate-limit, morgan |
| Frontend | React, Vite, React Router, Axios, react-hot-toast, lucide-react, plain CSS |

## Project structure

```
job-tracker-mern/
├── server/
│   └── src/
│       ├── config/db.js
│       ├── models/            User.js, Application.js
│       ├── controllers/       authController.js, applicationController.js
│       ├── routes/            authRoutes.js, applicationRoutes.js
│       ├── middleware/        authMiddleware.js, validate.js, errorHandler.js
│       ├── utils/             token.js, asyncHandler.js, AppError.js
│       ├── app.js
│       └── server.js
└── client/
    └── src/
        ├── api/               axios instance and error parsing
        ├── context/           AuthContext
        ├── components/        Navbar, PipelineBar, FilterBar, ApplicationList, Board, ApplicationModal, ...
        ├── pages/             AuthPage, Dashboard
        ├── hooks/ utils/
        └── App.jsx, main.jsx, index.css
```

## Setup and installation

**Requirements:** Node.js 18 or newer, npm, and a MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB).

```bash
git clone https://github.com/<your-username>/job-tracker-mern.git
cd job-tracker-mern

# Backend
cd server
npm install
cp .env.example .env      # then edit .env (see below)

# Frontend
cd ../client
npm install
```

### Environment variables (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Random string, at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS (default `http://localhost:5173`) |

## Running the application

Open two terminals.

```bash
# Terminal 1: API on http://localhost:5000
cd server
npm run dev

# Terminal 2: client on http://localhost:5173
cd client
npm run dev
```

Open http://localhost:5173, create an account, and add your first application. In development Vite proxies `/api` to the Express server, so the auth cookie stays same-origin.

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account, sets auth cookie |
| POST | `/api/auth/login` | Log in, sets auth cookie |
| POST | `/api/auth/logout` | Clears auth cookie |
| GET | `/api/auth/me` | Current user (requires login) |
| GET | `/api/applications` | List; query `status`, `search`, `sort` |
| GET | `/api/applications/stats` | Counts per status |
| POST | `/api/applications` | Create |
| PUT | `/api/applications/:id` | Update |
| DELETE | `/api/applications/:id` | Delete |

## Deployment notes

If the client and API are hosted on different domains, set `NODE_ENV=production` on the API (enables `Secure` and `SameSite=None` cookies), set `CLIENT_URL` to the client's URL, and set `VITE_API_URL` on the client to the API's `/api` URL. Both must be served over HTTPS.

## AI development experience

> **Fill this section in with what actually happened.** Reviewers want honest, specific detail, not generic claims. Delete this note when done.

**Code0 used:** [Yes or No. If you used a different tool such as Kiro, say so here and name it.]

**How I used AI assistance:** [2 to 4 sentences: which tool, at which stages, and how you checked its suggestions by reading the code, running it and testing it.]

**Specific tasks where AI helped:**

1. [e.g. Component development: generated the first version of ApplicationModal; I added field-level error handling from the API]
2. [e.g. API creation: scaffolded the CRUD controller; I changed the queries so they are always scoped to `req.user`]
3. [e.g. Debugging: found why the cookie was not sent across origins; I fixed it with the Vite proxy]
4. [e.g. Refactoring or testing]

**What I changed or rejected, and why:** [One or two examples of AI output you corrected.]
