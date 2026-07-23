const express = require("express");
const app = express();
const cors = require("cors");
const routers = require("./routers/applicantRouter");
const userRoutes = require("./routers/userRoutes");

const dotenv = require("dotenv");
dotenv.config();

// The Access-Control-Allow-Origin header must be a single origin string, not
// an array — setting it to an array serialized to a comma-joined value the
// browser rejects, which broke every cross-origin request (e.g. the ticket
// lookup). Echo back the request's Origin when it's in the allowlist.
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://job-fair-form.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);

  // Short-circuit CORS preflight so OPTIONS requests get the headers above
  // and a 204 instead of falling through to route handlers.
  if (req.method === "OPTIONS") return res.sendStatus(204);

  next();
});

app.use(express.json());

// Lightweight health endpoint — lets uptime checks (and a quick curl) confirm
// the service is actually up without hitting the database or an auth'd route.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/", routers);
app.use("/user", userRoutes);

module.exports = app;
