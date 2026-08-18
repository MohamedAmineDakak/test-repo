import { useEffect, useMemo, useState } from "react";
import type { Todo } from "../shared/types";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  toggleTodo,
} from "./api";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const todo = await createTodo(title);
      setTodos((prev) => [...prev, todo]);
      setTitle("");
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleToggle(todo: Todo) {
    try {
      const updated = await toggleTodo(todo.id, !todo.completed);
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="app">
      <section className="card">
        <header className="card__header">
          <h1>Todos</h1>
          <p className="subtitle">
            {loading
              ? "Loading…"
              : `${remaining} of ${todos.length} remaining`}
          </p>
        </header>

        <form className="composer" onSubmit={handleAdd}>
          <input
            aria-label="New todo"
            className="composer__input"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="composer__button" type="submit">
            Add
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <ul className="list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`item ${todo.completed ? "item--done" : ""}`}
            >
              <label className="item__label">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                />
                <span>{todo.title}</span>
              </label>
              <button
                aria-label={`Delete ${todo.title}`}
                className="item__delete"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>
            </li>
          ))}
          {!loading && todos.length === 0 && (
            <li className="empty">Nothing here yet — add your first todo.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
