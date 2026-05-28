const Task = require("../models/task");
const { isValidTaskTitle } = require("../utils/validators");

const getTasks = async (req, res) => {
  try {
    const { search = "", status = "all", page = 1, limit = 6 } = req.query;

    const query = {
      userId: req.user._id,
      title: { $regex: search, $options: "i" },
    };

    if (status !== "all") {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalTasks = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTasks / Number(limit)),
      totalTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!isValidTaskTitle(title)) {
      return res.status(400).json({
        message: "Task title must contain a meaningful word with at least 3 letters",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      userId: req.user._id,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (title !== undefined && !isValidTaskTitle(title)) {
      return res.status(400).json({
        message: "Task title must contain a meaningful word with at least 3 letters",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;

    const updatedTask = await task.save();

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = task.status === "pending" ? "completed" : "pending";

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};