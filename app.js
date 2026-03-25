import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Task from "./models/Task.js";

const app = express();
const PORT = 3000;

// Config
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Page routes
app.get("/", function(request, response){
  response.redirect("/index.html");
});

app.get("/register", function(request, response){
  response.redirect("/register.html");
});

// Dynamic dashboard
app.get("/dashboard", async function(request, response) {
  try {
    const tasksFromDb = await Task.find().sort({ createdAt: -1 });
    const tasksForView = [];

    for (let i = 0; i < tasksFromDb.length; i = i + 1) {
      const task = tasksFromDb[i];

      let dueText = task.due;
      if (!dueText) {
        dueText = "No due date";
      }

      tasksForView.push({
        id: task._id.toString(),
        title: task.title,
        priority: task.priority,
        dueText: dueText,
      });
    }

    response.render("dashboard", { tasks: tasksForView });
  } catch (err) {
    response.status(500);
    response.send("<h1>Server error</h1><p>Could not load tasks.</p>");
  }
});

// Dynamic route
app.get("/tasks/:id", async function(request, response) {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      response.status(404);
      response.render("not-found", { message: "No task with that id." });
      return;
    }

    let dueText = task.due;
    if (!dueText) {
      dueText = "No due date";
    }

    response.render("task", {
      task: {
        id: task._id.toString(),
        title: task.title,
        due: task.due,
        priority: task.priority,
      },
      dueText: dueText,
    });
  } catch (err) {
    response.status(400);
    response.render("not-found", { message: "Invalid task id." });
  }
});

// Create a task (form submit)
app.post("/tasks", async function(request, response) {
  try {
    const title = req.body.title;
    const due = req.body.due;
    const priority = req.body.priority;

    if (!title || title.trim() === "") {
      response.status(400);
      response.send("<h1>Bad request</h1><p>Title is required.</p>");
      return;
    }

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      response.status(400);
      response.send("<h1>Bad request</h1><p>Priority must be low, medium, or high.</p>");
      return;
    }

    const savedDue = due ? due : "";

    const newTask = await Task.create({
      title: title.trim(),
      due: savedDue,
      priority: priority,
    });

    response.redirect("/tasks/" + newTask._id.toString());
  } catch (err) {
    response.status(500);
    response.send("<h1>Server error</h1><p>Could not create task.</p>");
  }
});

// Create a task (JSON API)
app.post("/api/tasks", async function(request, response) {
  try {
    const title = req.body.title;
    const due = req.body.due;
    const priority = req.body.priority;

    if (!title || title.trim() === "") {
      response.status(400);
      response.json({ error: "Title is required." });
      return;
    }

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      response.status(400);
      response.json({ error: "Priority must be low, medium, or high." });
      return;
    }

    const savedDue = due ? due : "";

    const newTask = await Task.create({
      title: title.trim(),
      due: savedDue,
      priority: priority,
    });

    response.status(201);
    response.json({
      task: {
        id: newTask._id.toString(),
        title: newTask.title,
        due: newTask.due,
        priority: newTask.priority,
      },
    });
  } catch (err) {
    response.status(500);
    response.json({ error: "Could not create task." });
  }
});

//Connect MongoDB, then start server
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, function () {
      console.log("Task Tracker running at http://localhost:" + PORT);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();