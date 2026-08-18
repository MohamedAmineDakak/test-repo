import express, { type Express } from "express";
import { TodoStore, ValidationError } from "./todos.js";
import type {
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../shared/types.js";

export function createApp(store: TodoStore = new TodoStore()): Express {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/todos", (_req, res) => {
    res.json(store.list());
  });

  app.post("/api/todos", (req, res) => {
    const body = req.body as CreateTodoRequest;
    try {
      const todo = store.create(body?.title ?? "");
      res.status(201).json(todo);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  });

  app.patch("/api/todos/:id", (req, res) => {
    const body = req.body as UpdateTodoRequest;
    try {
      const todo = store.update(req.params.id, body ?? {});
      if (!todo) {
        res.status(404).json({ error: "todo not found" });
        return;
      }
      res.json(todo);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  });

  app.delete("/api/todos/:id", (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "todo not found" });
      return;
    }
    res.status(204).end();
  });

  return app;
}
