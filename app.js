import express from "express";

const app = express();
app.set("view engine", "ejs");
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const tasks = [];
let nextId = 1;

// Page routes
app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.get("/register", function (req, res) {
  res.redirect("/register.html");
});

app.get("/dashboard.html", function (req, res) {
  res.redirect("/dashboard");
});

// Dynamic dashboard
app.get("/dashboard", function (req, res) {
  const tasksForView = [];

  for (let i = 0; i < tasks.length; i = i + 1) {
    const task = tasks[i];

    let dueText = task.due;
    if (!dueText) {
      dueText = "No due date";
    }

    const taskForView = {
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueText: dueText,
    };

    tasksForView.push(taskForView);
  }

  res.render("dashboard", { tasks: tasksForView });
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
    res.render("not-found", { message: "No task with that id." });
    return;
  }

  let dueText = task.due;
  if (!dueText) {
    dueText = "No due date";
  }

  res.render("task", { task: task, dueText: dueText });
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


app.post("/api/tasks", function (req, res) {
  const title = req.body.title;
  const due = req.body.due;
  const priority = req.body.priority;

  if (!title || title.trim() === "") {
    res.status(400);
    res.json({ error: "Title is required." });
    return;
  }

  if (priority !== "low" && priority !== "medium" && priority !== "high") {
    res.status(400);
    res.json({ error: "Priority must be low, medium, or high." });
    return;
  }

  let savedDue = due;
  if (!savedDue) {
    savedDue = "";
  }

  const newTask = {
    id: nextId,
    title: title.trim(),
    due: savedDue,
    priority: priority,
  };

  nextId = nextId + 1;
  tasks.push(newTask);

  res.status(201);
  res.json({ task: newTask });
});

app.use(express.static("public"));

app.listen(PORT, function () {
  console.log("Task Tracker running at http://localhost:" + PORT);
});
