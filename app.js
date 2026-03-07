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

// Dynamic dashboard
app.get("/dashboard", function (req, res) {
  let taskItemsHtml = "";
  for (let i = 0; i < tasks.length; i = i + 1) {
    const task = tasks[i];

    taskItemsHtml =
      taskItemsHtml +
      `<li>
        <a href="/tasks/${task.id}">${task.title}</a>
      </li>`;
  }

  let emptyStateHtml = "";
  if (tasks.length === 0) {
    emptyStateHtml =
      '<p class="empty-state">No tasks yet.</p>';
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Task Tracker Dashboard</title>
        <link rel="stylesheet" href="/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
        <header class="site-header">
          <h1>Task Tracker</h1>
          <nav class="site-nav" aria-label="Primary navigation">
            <ul class="nav-list">
              <li><a href="/index.html">Login</a></li>
              <li><a href="/register.html">Register</a></li>
              <li><a href="/dashboard" aria-current="page">Dashboard</a></li>
            </ul>
          </nav>
        </header>

        <main class="site-main" id="main">
          <h2>Dashboard</h2>

          <div class="dashboard-grid">
            <section class="panel" aria-labelledby="add-task-title">
              <h3 id="add-task-title">Add a task</h3>

              <form class="auth-form" action="/tasks" method="post">
                <p>Create a new task</p>

                <div class="field">
                  <label for="task-name">Task name:</label>
                  <input
                    id="task-name"
                    name="title"
                    type="text"
                    required
                    autocomplete="off"
                    placeholder="e.g., Finish Hand-in 1"
                  >
                </div>

                <div class="field">
                  <label for="task-due">Due date:</label>
                  <input id="task-due" name="due" type="date">
                </div>

                <div class="field">
                  <label for="task-priority">Priority</label>
                  <select id="task-priority" name="priority" required>
                    <option value="">Select priority…</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <button class="btn" type="submit">Add task</button>
              </form>
            </section>

            <section class="panel" aria-labelledby="task-list-title">
              <h3 id="task-list-title">Your Tasks</h3>
              ${emptyStateHtml}
              <ul class="task-list" aria-label="Task list">
                ${taskItemsHtml}
              </ul>
            </section>
          </div>
        </main>
      </body>
    </html>
  `);
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
