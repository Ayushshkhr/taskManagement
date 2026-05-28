const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("node:dns");
const connectDB = require("./config/dataBase");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

app.use( cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Management API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});