# 📊 Competitive Programming Analytics Platform

A full-stack web application that tracks competitive
programming progress across **LeetCode** and **Codeforces** — built with
**React**, **Express**, **MySQL**, and **JWT authentication**.

```
contest-analytics/
├── backend/     Express REST API · MySQL · JWT auth · external API clients
└── frontend/    React app · React Router · Context API · Recharts
```

---

## ✨ Features

### 1. User Authentication
- Register, Login, Logout
- Password hashing with **bcrypt**
- **JWT**-based stateless authentication
- Protected routes (frontend + backend)

**Tech used:** React Router · Context API · JWT · Express Middleware · SQL

---

### 2. User Dashboard
- Total problems solved (across linked platforms)
- Current rating snapshot
- Combined LeetCode + Codeforces overview
- Quick-access links to detailed analysis pages

**Tech used:** React Components · `useState` · `useEffect` · Axios (Fetch-style API calls) · Charts

---

### 3. LeetCode Profile Analysis
Enter any LeetCode username to view:
- Easy / Medium / Hard solved counts
- Acceptance rate
- Global ranking
- Recent submission history
- Problem-solving heatmap (calendar-style activity view)

**Tech used:** REST APIs (proxied GraphQL) · Async/Await · JSON Parsing · React State

---

### 4. Codeforces Profile Analysis
Enter any Codeforces handle to view:
- Current rating & rank
- Max rating & max rank
- Full contest history
- Rating progression graph

**Tech used:** External APIs (Codeforces REST API) · Recharts

---

### 5. Rating Progress Visualization
- Rating growth plotted over time
- Contest-by-contest performance trend
- Shared line-chart component reused across LeetCode & Codeforces pages

**Tech used:** Recharts · Data Visualization

---

### 6. Problem Difficulty Distribution
- Pie chart breakdown of Easy / Medium / Hard solved problems
- Color-coded by difficulty

**Tech used:** Recharts (Pie Chart) · Array Manipulation

---

### 7. Contest History
Table containing:
- Contest Name
- Rank
- Rating Change (color-coded ± )
- Date

---

## 📁 Project Structure

### Backend (`/backend`)

```
backend/
├── config/
│   ├── db.js              MySQL connection pool
│   ├── schema.sql          Full DB schema (users, linked_profiles, etc.)
│   └── initDb.js            Script to create DB from schema.sql
├── controllers/            Route handler logic (one file per resource)
│   ├── authController.js
│   ├── leetcodeController.js
│   ├── codeforcesController.js
│   ├── dashboardController.js
│   └── profileController.js
├── middleware/
│   ├── authMiddleware.js    JWT verification (protects routes)
│   └── errorMiddleware.js   Centralized error formatting
├── models/                  
│   ├── userModel.js
│   └── profileModel.js
├── routes/                  Express routers, one file per resource
├── utils/
│   ├── jwt.js                 Token sign/verify helpers
│   ├── asyncHandler.js         Wraps async routes for error handling
│   ├── leetcodeApi.js           LeetCode GraphQL client
│   └── codeforcesApi.js         Codeforces REST client
└── server.js                App entry point
```

### Frontend (`/frontend/src`)

```
src/
├── components/
│   ├── charts/        RatingLineChart · DifficultyPieChart · ComparisonBarChart · SubmissionHeatmap
│   ├── common/         LoadingSpinner · ErrorMessage · StatCard
│   └── layout/         Navbar · PageLayout · ProtectedRoute
├── context/
│   └── AuthContext.jsx    Global auth state (Context API)
├── pages/               Login · Register · Dashboard · LeetCodeProfile ·
│                        CodeforcesProfile · Friends · Settings · NotFound
├── services/             One Axios-based API client per backend resource
├── utils/
│   └── formatters.js       Date/number/rank formatting helpers
├── styles/
│   └── App.css              Single shared stylesheet
├── App.jsx               Route definitions (React Router)
└── index.js               ReactDOM entry point
```
