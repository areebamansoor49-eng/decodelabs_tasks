const tasks = require("../data/tasks");

const getAllTasks = (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

const getTaskById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: "Task ID must be a valid number"
    });
  }

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

const createTask = (req, res) => {
  const { title, description, status, priority } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required and must be a non-empty string"
    });
  }

  const validStatuses = ["pending", "in-progress", "completed"];
  const validPriorities = ["low", "medium", "high"];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be pending, in-progress, or completed"
    });
  }

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: "Priority must be low, medium, or high"
    });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    title: title.trim(),
    description: description ? String(description).trim() : "",
    status: status || "pending",
    priority: priority || "medium"
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask
  });
};

const updateTask = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: "Task ID must be a valid number"
    });
  }

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const { title, description, status, priority } = req.body;

  const validStatuses = ["pending", "in-progress", "completed"];
  const validPriorities = ["low", "medium", "high"];

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title must be a non-empty string"
      });
    }

    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = String(description).trim();
  }

  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be pending, in-progress, or completed"
      });
    }

    task.status = status;
  }

  if (priority !== undefined) {
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be low, medium, or high"
      });
    }

    task.priority = priority;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task
  });
};

const deleteTask = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: "Task ID must be a valid number"
    });
  }

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
