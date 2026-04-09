import session from "express-session";
import MongoStore from "connect-mongo";
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

if (!process.env.SESSION_SECRET) {
  console.error("Missing SESSION_SECRET environment variable");
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Static page routes
app.get("/", function(request, response){
  response.redirect("/index.html");
});

app.get("/register", function(request, response){
  response.redirect("/register.html");
});

// Dynamic dashboard route (SSR)
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

// Task details route (SSR)
app.get("/tasks/:id", async function(request, response) {
  try {
    const taskId = request.params.id;
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

// Create task (CRUD): form submit -> create in DB -> redirect to /tasks/:id
app.post("/tasks", async function(request, response) {
  try {
    const title = request.body.title;
    const due = request.body.due;
    const priority = request.body.priority;

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

// Create task (CRUD): JSON API -> create in DB -> return JSON
app.post("/api/tasks", async function(request, response) {
  try {
    const title = request.body.title;
    const due = request.body.due;
    const priority = request.body.priority;

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

//Delete tasks (CRUD)
app.post("/tasks/:id/delete", async function (request, response) {
  try {
    const taskId = request.params.id;

    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) {
      response.status(404);
      response.render("not-found", { message: "No task with that id." });
      return;
    }

    response.redirect("/dashboard");
  } catch (err) {
    response.status(400);
    response.render("not-found", { message: "Invalid task id." });
  }
});

// Edit form (SSR): show edit page for one task
app.get("/tasks/:id/edit", async function (request, response) {
  try {
    const taskId = request.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      response.status(404);
      response.render("not-found", { message: "No task with that id." });
      return;
    }

    response.render("edit-task", {
      task: {
        id: task._id.toString(),
        title: task.title,
        due: task.due,
        priority: task.priority,
      },
    });
  } catch (err) {
    response.status(400);
    response.render("not-found", { message: "Invalid task id." });
  }
});

// Update a task (CRUD): form submit -> update in DB -> redirect
app.post("/tasks/:id", async function (request, response) {
  try {
    const taskId = request.params.id;

    const title = request.body.title;
    const due = request.body.due;
    const priority = request.body.priority;

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

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { title: title.trim(), due: due ? due : "", priority },
      { new: true, runValidators: true }
    );

    if (!updated) {
      response.status(404);
      response.render("not-found", { message: "No task with that id." });
      return;
    }

    response.redirect("/tasks/" + updated._id.toString());
  } catch (err) {
    response.status(400);
    response.render("not-found", { message: "Invalid task id." });
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