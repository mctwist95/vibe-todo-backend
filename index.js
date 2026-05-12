require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = require("./routers/todoRoutes");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-backend";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Node.js backend is ready",
    method: req.method,
    path: req.originalUrl,
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("연결 성공");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  }
}

startServer();
