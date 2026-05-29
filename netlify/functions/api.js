const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Import your existing routes
app.use("/api/admin", require("../../backend/routes/adminRoutes"));
app.use("/api/drivers", require("../../backend/routes/driverRoutes"));

// Optional test route
app.get("/api/health", (req, res) => res.json({ ok: true }));

module.exports.handler = serverless(app);
