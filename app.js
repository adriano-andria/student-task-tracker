import express from "express";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

const tasks = [];
let nextId = 1;

// Page routes
app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.get("/register", function (req, res) {
  res.redirect("/register.html");
});

app.get("/dashboard", function (req, res) {
  res.redirect("/dashboard.html");
});

// Dynamic route
app.get("/tasks/:id", function (req, res) {
  const taskId = parseInt(req.params.id, 10);

  let task = null;
  for (let i = 0; i < tasks.length; i = i + 1) {
    if (tasks[i].id === taskId) {
      task = tasks[i];
      break;
    }
  }

  if (task === null) {
    res.status(404);
    res.send("<h1>Task not found</h1><p>No task with that id.</p>");
    return;
  }

  let dueText = task.due;
  if (!dueText) {
    dueText = "No due date";
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Task ${task.id}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="site-main" id="main">
          <h2>Task Details (Dynamic Route)</h2>
          <div class="auth-form">
            <p><strong>ID:</strong> ${task.id}</p>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Due:</strong> ${dueText}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><a href="/dashboard">Back to dashboard</a></p>
          </div>
        </main>
      </body>
    </html>
  `);
});

// Create a task
app.post("/tasks", function (req, res) {
  const title = req.body.title;
  const due = req.body.due;
  const priority = req.body.priority;

  let savedDue = due;
  if (!savedDue) {
    savedDue = "";
  }

  const newTask = {
    id: nextId,
    title: title,
    due: savedDue,
    priority: priority,
  };

  nextId = nextId + 1;
  tasks.push(newTask);

  res.redirect("/tasks/" + newTask.id);
});

app.listen(PORT, function () {
  console.log("Task Tracker running at http://localhost:" + PORT);
});
