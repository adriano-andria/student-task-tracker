# Task Tracker

## Live Demo
[View the deployed app](https://student-task-tracker-gsmg.onrender.com)

---

## Description

Task Tracker is a full-stack web application that allows users to register, log in, and manage their own tasks.

Users can create, view, edit, and delete tasks through a simple dashboard interface. The project uses server-side rendering with EJS for the main pages and also includes client-side JavaScript so tasks can be added from the dashboard without reloading the page.

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- EJS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication and Sessions
- bcrypt
- express-session
- connect-mongo

### Security and Middleware
- helmet
- express-rate-limit

### Development Tools
- dotenv
- nodemon

### Testing
- Jest
- Supertest

---

## Features

- user registration
- user login and logout
- password hashing with bcrypt
- session-based authentication
- protected dashboard route
- create, read, update, and delete tasks
- MongoDB database storage
- dynamic dashboard task creation using JavaScript
- server-rendered pages with EJS
- Rate limiting for login and registration routes
- Secure production deployment on Render

## Installation and Setup

### 1. Clone the repository
git clone https://github.com/adriano-andria/student-task-tracker.git
cd student-task-tracker

### 2. Install dependencies
npm install

### 3. Create a .env file
Add the following to a .env file in the root folder:

MONGODB_URI=your-mongodb-uri
SESSION_SECRET=your-session-secret

### 4. Start MongoDB
Make sure MongoDB is installed and running locally before starting the application.

### 5. Start the app
npm start

For development:
npm run dev

### 6. Open the project
Visit: http://localhost:3000

## How to Use
- Register a new account
- Log in with your account details
- Open the dashboard
- Add a new task using the form
- Click a task to view its details
- Edit or delete tasks as needed

## Testing
Automated tests using Jest and Supertest.
To run tests: npm test

What’s currently tested:
- validateTask unit tests
- basic route redirects (like / and /dashboard)
- simple UI route behavior (/register)

## Deployment
The app is deployed on Render and uses MongoDB Atlas for the production database.

## Credits
Created by Adriano