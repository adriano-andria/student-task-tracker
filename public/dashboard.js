const form = document.querySelector("#add-task-form");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const titleInput = document.querySelector("#task-name");

// Return fallback text when a task has no due date
function getDueText(due) {
  return due ? due : "No due date";
}

// Hide the empty-state message once the first task is added
function hideEmptyState() {
  if (emptyState) {
    emptyState.style.display = "none";
  }
}

// Build one task <li> so that the submit handler stays shorter and easier to read
function createTaskListItem(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const a = document.createElement("a");
  a.className = "task-title";
  a.href = "/tasks/" + task.id;
  a.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const dueLine = document.createElement("span");
  const dueStrong = document.createElement("strong");
  dueStrong.textContent = "Due:";
  dueLine.appendChild(dueStrong);
  dueLine.appendChild(document.createTextNode(" " + getDueText(task.due)));

  const priorityLine = document.createElement("span");
  const priorityStrong = document.createElement("strong");
  priorityStrong.textContent = "Priority:";
  priorityLine.appendChild(priorityStrong);
  priorityLine.appendChild(document.createTextNode(" " + task.priority));

  meta.appendChild(dueLine);
  meta.appendChild(priorityLine);

  li.appendChild(a);
  li.appendChild(meta);

  return li;
}

// Send the form data to the JSON API and update the page without reloading
async function submitTask(event) {
  event.preventDefault();

  const fd = new FormData(form);

  const payload = {
    title: fd.get("title"),
    due: fd.get("due"),
    priority: fd.get("priority"),
  };

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let data = null;

      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }

      const message = data && data.error ? data.error : "Could not add task.";
      alert(message);
      return;
    }

    const data = await response.json();
    const task = data.task;

    hideEmptyState();
    list.prepend(createTaskListItem(task));

    form.reset();

    if (titleInput) {
      titleInput.focus();
    }
  } catch (err) {
    alert("Could not add task.");
  }
}

if (form && list) {
  form.addEventListener("submit", submitTask);
}