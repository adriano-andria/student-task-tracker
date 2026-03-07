import express from "express";

const app = express();
const PORT = 3000;

// 1) Serve the static files from /public
app.use(express.static("public"));

// 2) Backend routes
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/register", (req, res) => {
  res.redirect("/register.html");
});

app.get("/dashboard", (req, res) => {
  res.redirect("/dashboard.html");
});

app.get("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Task ${taskId}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="site-main" id="main">
          <h2>Task Details</h2>
          <div class="auth-form">
            <p><strong>Task ID from URL:</strong> ${taskId}</p>
            <p><a href="/dashboard">Back to dashboard</a></p>
          </div>
        </main>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Task Tracker running at http://localhost:${PORT}`);
});