import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

// When a production client build exists (see `npm run build:client`), serve it
// so `npm start` yields a working app on a single port.
const clientDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
if (fs.existsSync(path.join(clientDir, "index.html"))) {
  app.use(express.static(clientDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`[server] Todo API listening on http://localhost:${port}`);
});
