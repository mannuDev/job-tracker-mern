# Jobwise: Job Application Tracker (MERN)

Jobwise is a full-stack job application tracker built with the MERN stack. Users create an account, log every application they send, move each one through the hiring stages, and see their whole job search on one dashboard.

## Key features

- Register and log in with JWT authentication stored in an **httpOnly cookie**
- Passwords hashed with bcrypt
- Create, read, update and delete job applications (company, role, status, date applied, location, job link, notes)
- **User-isolated data:** every database query is scoped to the logged-in user, so nobody can read or edit another user's records
- Pipeline bar showing the share of applications in each stage; click a stage to filter
- Search by company or role, filter by status, sort by date or company
- List view and drag-and-drop board view (Applied, Interview, Offer, Rejected)
- Client-side and server-side validation with field-level error messages
- Responsive layout for desktop, tablet and mobile, with keyboard-accessible controls and light and dark themes
- Security middleware (Helmet, CORS), rate-limited auth routes, request size limits and centralized error handling

## Technologies used

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, react-hot-toast, lucide-react, plain CSS |
| Backend | Node.js, Express 4, jsonwebtoken, bcryptjs, express-validator, morgan |
| Database | MongoDB, Mongoose |
| Security | httpOnly cookies, Helmet, CORS, express-rate-limit |
| Development | Git, GitHub, VS Code, Code0 |

## Project structure

```text
job-tracker-mern/
├── client/
│   └── src/
│       ├── api/            Axios instance and error parsing
│       ├── components/     Navbar, PipelineBar, FilterBar, ApplicationList, Board, ApplicationModal, ...
│       ├── context/        AuthContext
│       ├── hooks/          useDebounce
│       ├── pages/          AuthPage, Dashboard
│       ├── utils/          formatting helpers
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── server/
│   └── src/
│       ├── config/         Database connection
│       ├── controllers/    authController, applicationController
│       ├── middleware/     authMiddleware, validate, errorHandler
│       ├── models/         User, Application
│       ├── routes/         authRoutes, applicationRoutes
│       ├── utils/          token, asyncHandler, AppError
│       ├── app.js
│       └── server.js
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB Atlas cluster or a local MongoDB instance
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/mannuDev/job-tracker-mern.git
cd job-tracker-mern
```

Install the backend dependencies:

```bash
cd server
npm install
```

Create `server/.env` from the example file and fill in the values described below:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Install the frontend dependencies:

```bash
cd ../client
npm install
```

## Environment variables

Set these in `server/.env`. Use the exact variable names.

| Variable | Purpose | Example |
| --- | --- | --- |
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string, including the database name | `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/job-tracker?retryWrites=true&w=majority` |
| `JWT_SECRET` | Random secret, at least 32 characters | *(generate below)* |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit `.env` files, database credentials or JWT secrets. The repository includes `.env.example` with placeholder values only.

## Running the application

Use two terminals.

**Terminal 1: backend (http://localhost:5000)**

```bash
cd server
npm run dev
```

You should see `MongoDB connected` and `API running on http://localhost:5000`.

**Terminal 2: frontend (http://localhost:5173)**

```bash
cd client
npm run dev
```

Open http://localhost:5173, create an account, and add your first application.

In development, Vite proxies `/api` requests to the Express server, so the auth cookie stays same-origin and no extra CORS setup is needed.

## API reference

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Health check |
| `POST` | `/api/auth/register` | No | Register and start a session |
| `POST` | `/api/auth/login` | No | Log in |
| `POST` | `/api/auth/logout` | No | Clear the session cookie |
| `GET` | `/api/auth/me` | Yes | Get the current user |
| `GET` | `/api/applications` | Yes | List applications. Query: `status`, `search`, `sort` (`newest`, `oldest`, `company`) |
| `GET` | `/api/applications/stats` | Yes | Application counts per status |
| `POST` | `/api/applications` | Yes | Create an application |
| `PUT` | `/api/applications/:id` | Yes | Update an application you own |
| `DELETE` | `/api/applications/:id` | Yes | Delete an application you own |

Validation failures return `422` with a `message` and an `errors` object keyed by field name.

## Security and design decisions

- **httpOnly cookie for the JWT.** Browser JavaScript cannot read the token, which limits the damage of an XSS bug. In production the cookie is `Secure` and `SameSite=None` so a separately hosted client can use it.
- **Ownership enforced in the query.** Update and delete use `{ _id, user: req.user._id }`, so another user's record returns "not found" instead of being modified.
- **Whitelisted fields.** Controllers copy only known fields from the request body, so clients cannot set `user` or other internal fields.
- **No account probing.** Login returns the same message for a wrong email and a wrong password.
- **Password hashes stay out of queries.** The `password` field is `select: false` and is only loaded during login.
- **Escaped search.** User search text is regex-escaped before it reaches MongoDB.
- **Rate limiting** on the register and login routes to slow down password guessing.
- **Centralized error handling** converts Mongoose, JWT and validation errors into consistent JSON responses.

## Production build

```bash
cd client
npm run build
```

The build output is generated in `client/dist/`.

## Deployment notes

When the frontend and API are hosted on different domains:

1. On the API, set `NODE_ENV=production` and set `CLIENT_URL` to the frontend's HTTPS URL.
2. On the client, set `VITE_API_URL` to the API's `/api` URL (see `client/.env.example`).
3. Serve both over HTTPS so the `Secure` cookie is accepted.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `JWT_SECRET must be set and at least 32 characters long` | Generate a secret with the command above and add it to `server/.env` |
| `MONGO_URI is not set` | Make sure the file is named `.env` and lives inside `server/` |
| MongoDB authentication or connection errors | Check the Atlas username and password, and allow your IP address in Atlas Network Access |
| Port 5000 already in use | Change `PORT` in `server/.env` and update the proxy target in `client/vite.config.js` |
| Redirected to login after signing in | Open the app at `http://localhost:5173`, not the API port |

## AI development experience

**Confirmation:** Code0 was used as part of the development workflow in VS Code. Claude and ChatGPT were also used for code generation, review and debugging guidance.

**How AI assistance was used:** AI tools helped plan the architecture, generate the initial project structure, review the integration between the React client and Express API, investigate configuration errors, and prepare a submission checklist. Suggestions were not accepted blindly. They were read against the existing code, run in the terminal, and corrected where they did not work.

**Specific tasks where AI helped:**

1. **Component development:** Reviewed the React component structure and the application form fields (company, role, status, date, location, link and notes).
2. **API implementation:** Reviewed the Express routes and CRUD controllers, including validation rules and the ownership checks on update and delete.
3. **Database integration and debugging:** Investigated the MongoDB Atlas connection issue and confirmed the fix by checking that the server started and connected successfully in the terminal.
4. **Configuration:** Worked through the `.env` setup, including the connection string format and JWT secret requirements.
5. **Documentation:** Reviewed and improved this README and prepared a submission-readiness checklist.

**Verification status:**

- The frontend production build completes successfully.
- The backend connects to MongoDB Atlas and starts successfully.
- Server validation, the authentication guard and 404 handling respond with the expected status codes.
- Full browser-based testing of registration, login, CRUD, persistence after refresh, and user isolation is still to be recorded here once completed.

## Future improvements

- Automated API and component tests
- Deployment links after production deployment
- Reminders for follow-ups and interview dates
- Analytics on response rates and time between stages

## Author

**Mannu Kumar**

GitHub: https://github.com/mannuDev
