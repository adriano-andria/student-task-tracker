import request from "supertest";
import app from "../app.js";

describe("GET /", function () {
  test("redirects to /index.html", async function () {
    const response = await request(app).get("/").redirects(0);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/index.html");
  });
});
