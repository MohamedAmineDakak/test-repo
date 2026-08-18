import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { TodoStore } from "./todos.js";

describe("todos API", () => {
  it("reports health", async () => {
    const app = createApp(new TodoStore());
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("starts with an empty list", async () => {
    const app = createApp(new TodoStore());
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("creates, updates and deletes a todo", async () => {
    const app = createApp(new TodoStore());

    const created = await request(app)
      .post("/api/todos")
      .send({ title: "Write tests" });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("Write tests");
    expect(created.body.completed).toBe(false);

    const id = created.body.id as string;

    const updated = await request(app)
      .patch(`/api/todos/${id}`)
      .send({ completed: true });
    expect(updated.status).toBe(200);
    expect(updated.body.completed).toBe(true);

    const listed = await request(app).get("/api/todos");
    expect(listed.body).toHaveLength(1);

    const removed = await request(app).delete(`/api/todos/${id}`);
    expect(removed.status).toBe(204);

    const empty = await request(app).get("/api/todos");
    expect(empty.body).toEqual([]);
  });

  it("rejects empty titles", async () => {
    const app = createApp(new TodoStore());
    const res = await request(app).post("/api/todos").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown todos", async () => {
    const app = createApp(new TodoStore());
    const res = await request(app)
      .patch("/api/todos/does-not-exist")
      .send({ completed: true });
    expect(res.status).toBe(404);
  });
});
