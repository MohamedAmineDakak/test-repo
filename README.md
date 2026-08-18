# test-repo

A small full-stack **Todo** application used to exercise the Cloud Agent
development environment end to end.

- **Client** — React 18 + TypeScript, bundled with [Vite](https://vitejs.dev).
- **Server** — [Express](https://expressjs.com) REST API (in-memory store).
- **Tests** — [Vitest](https://vitest.dev) + [supertest](https://github.com/ladjs/supertest).

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start API (:3001) and client (:5173) together
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the
Express server on port `3001`.

## Scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Run the API and client together (watch mode). |
| `npm run dev:server`| Run only the Express API.                     |
| `npm run dev:client`| Run only the Vite client.                     |
| `npm run build`     | Build the client and compile the server.      |
| `npm start`         | Run the compiled server from `dist/`.         |
| `npm run typecheck` | Type-check client and server.                 |
| `npm run lint`      | Lint with ESLint.                             |
| `npm test`          | Run the Vitest suite.                         |

## API

| Method   | Path               | Description        |
| -------- | ------------------ | ------------------ |
| `GET`    | `/api/health`      | Health check.      |
| `GET`    | `/api/todos`       | List todos.        |
| `POST`   | `/api/todos`       | Create a todo.     |
| `PATCH`  | `/api/todos/:id`   | Update a todo.     |
| `DELETE` | `/api/todos/:id`   | Delete a todo.     |

## Project layout

```
server/   Express API + tests
src/      React client
shared/   Types shared by client and server
```
