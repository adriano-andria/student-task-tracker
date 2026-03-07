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

app.listen(PORT, () => {
  console.log(`Task Tracker running at http://localhost:${PORT}`);
});