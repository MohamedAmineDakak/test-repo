import { randomUUID } from "node:crypto";
import type { Todo } from "../shared/types.js";

/**
 * In-memory todo store. Kept intentionally simple so the environment can be
 * demonstrated end to end without provisioning an external database.
 */
export class TodoStore {
  private todos = new Map<string, Todo>();

  list(): Todo[] {
    return [...this.todos.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  }

  create(title: string): Todo {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new ValidationError("title must not be empty");
    }
    const todo: Todo = {
      id: randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  update(
    id: string,
    changes: { completed?: boolean; title?: string },
  ): Todo | undefined {
    const existing = this.todos.get(id);
    if (!existing) {
      return undefined;
    }
    if (changes.title !== undefined) {
      const trimmed = changes.title.trim();
      if (!trimmed) {
        throw new ValidationError("title must not be empty");
      }
      existing.title = trimmed;
    }
    if (changes.completed !== undefined) {
      existing.completed = changes.completed;
    }
    this.todos.set(id, existing);
    return existing;
  }

  remove(id: string): boolean {
    return this.todos.delete(id);
  }

  clear(): void {
    this.todos.clear();
  }
}

export class ValidationError extends Error {}
