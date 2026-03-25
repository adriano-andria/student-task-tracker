Project idea for SE_19 & SE_01 LU Assessments:
Student Task Tracker (Multi-User)
A web application where:
- Users can register and log in
- Each user has their own private tasks
- Users can create, edit, delete, and complete tasks
- Data is stored securely in a database
- Frontend dynamically updates based on backend responses

# (Hand-in 1)

## Overview
- This is a front-end prototype for a Task Tracker web app.
- Hand-in 1 focuses on HTML and CSS only

The prototype includes:
- A Login page
- A Registration page
- A Dashboard page (with an “Add task” form and an empty task list)

## Files
- `index.html` — Login page
- `register.html` — Registration page
- `styles.css` — Shared styling for all pages

## How to run
1. Download/open the project folder.
2. Open `index.html` in a web browser.
3. Use the navigation links to move between pages.

*Forms do not submit real data yet.

## Features included for Hand-in 1
### Navigation
- Consistent header navigation across all pages.
- The current page is highlighted using `aria-current="page"`.

### Forms
- Login form includes email + password fields.
- Registration form includes name, email, password, and confirm password.

### Dashboard (prototype)
- Contains an “Add a task” form (task name, due date, priority).
- Shows an empty state message: “No tasks yet…”

### Responsive design (breakpoints)
The site is responsive using CSS media queries (breakpoints):

- **600px and up**
  - Navigation switches from vertical to horizontal.
  - Header uses a side-by-side layout (title left, nav right).

- **900px and up**
  - Page padding increases for larger screens.
  - Dashboard layout switches to two columns.

# (Hand-in 2)

## Overview
This project now runs as a Node/Express web app with MongoDB (Mongoose).

Current functionality:
- Serves the static pages from `public/` (Login + Register pages still exist as static HTML)
- Provides a **server-rendered** Dashboard at `/dashboard` (EJS) that lists tasks from the database
- Supports creating tasks via a form POST and viewing a task details page
- Supports creating tasks via a JSON API (used by client-side dashboard JavaScript)

## Routes
Page / UI routes:
- `GET /` → redirects to `/index.html`
- `GET /register` → redirects to `/register.html`
- `GET /dashboard` → dashboard page (server-rendered via EJS)

Task routes:
- `POST /tasks` → create a task (form submit), then redirect to `/tasks/:id`
- `GET /tasks/:id` → view a single task (404 if not found)

API routes:
- `POST /api/tasks` → create a task (JSON), returns `{ task: ... }`

## How to run (Express version)
1. Install Node.js (version 18 or newer).
2. Download/clone this project and open a terminal in the project folder.
3. Create a `.env` file with your Mongo connection string:
   - `MONGODB_URI=your_mongodb_connection_string_here`
4. Install dependencies: `npm install`
5. Start the server: `npm run dev`
6. Open in your browser: http://localhost:3000/
