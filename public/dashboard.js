const form = document.querySelector("#add-task-form");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");

if (form && list) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Read user input from the form
    const fd = new FormData(form);

    const payload = {
      title: fd.get("title"),
      due: fd.get("due"),
      priority: fd.get("priority"),
    };

    // Send the task to the server (JSON API)
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

    // Hide the empty state message
    if (emptyState) {
      emptyState.style.display = "none";
    }

    // Build the new <li> using DOM methods
    const li = document.createElement("li");
    li.className = "task-item";

    const a = document.createElement("a");
    a.className = "task-title";
    a.href = "/tasks/" + task.id;
    a.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    // Due line: "Due: ____"
    const dueLine = document.createElement("span");
    const dueStrong = document.createElement("strong");
    dueStrong.textContent = "Due:";
    dueLine.appendChild(dueStrong);
    dueLine.appendChild(document.createTextNode(" " + (task.due ? task.due : "No due date")));

    // Priority line: "Priority: ____"
    const priorityLine = document.createElement("span");
    const priorityStrong = document.createElement("strong");
    priorityStrong.textContent = "Priority:";
    priorityLine.appendChild(priorityStrong);
    priorityLine.appendChild(document.createTextNode(" " + task.priority));

    meta.appendChild(dueLine);
    meta.appendChild(priorityLine);

    li.appendChild(a);
    li.appendChild(meta);

    // Add the new task to the top of the list
    list.prepend(li);

    // Reset form for next task
    form.reset();

    const titleInput = document.querySelector("#task-name");
    if (titleInput) {
      titleInput.focus();
    }
  });
}
