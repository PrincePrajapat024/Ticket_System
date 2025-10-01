const express = require("express");
const dotenv = require("dotenv");
const pool = require("./db");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON requests

// Routes mounted under /api
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/registrations", require("./routes/register"));

app.get("/", (req, res) => res.send("Event Registration API 🚀"));

// Test DB connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ server_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
