import express from "express";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import connectDatabase from "./database/connectDatabase.js";
import { env, isDev } from "./lib/env.js";
import userRouter from "./routes/user.routes.js";

// ESM এ __filename এবং __dirname তৈরি করা
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = next({
  dev: isDev,
  dir: path.join(__dirname, "../frontend"),
});
const handle = app.getRequestHandler(); // Next.js request handler

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // Home Page Route
  server.get("/api/hello", (req, res) => {
    res.send("Hello, Express!");
  });

  // User Routes
  server.use("/api/users", userRouter);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Server is Running
  server.listen(env.PORT, () => {
    connectDatabase();
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
});
