const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id/status", protect, toggleTaskStatus);

module.exports = router;