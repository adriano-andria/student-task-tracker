import validateTask from "../utils/validateTask.js";

describe("validateTask", function () {
  test("returns null for valid title and valid priority", function () {
    const result = validateTask("Finish homework", "high");

    expect(result).toBe(null);
  });

  test("returns an error when title is missing", function () {
    const result = validateTask("", "high");

    expect(result).toBe("Title is required.");
  });

  test("returns an error when priority is invalid", function () {
    const result = validateTask("Finish homework", "urgent");

    expect(result).toBe("Priority must be low, medium, or high.");
  });
});
