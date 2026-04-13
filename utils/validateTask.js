function validateTask(title, priority) {
  if (!title || title.trim() === "") {
    return "Title is required.";
  }

  if (title.trim().length > 150) {
    return "Title must be 150 characters or less.";
  }

  if (priority !== "low" && priority !== "medium" && priority !== "high") {
    return "Priority must be low, medium, or high.";
  }

  return null;
}

export default validateTask;
