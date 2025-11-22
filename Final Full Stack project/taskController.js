import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy = "createdAt", order = "desc" } = req.query;
    let query = { user: req.user };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort({ [sortBy]: order === "asc" ? 1 : -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user }, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};