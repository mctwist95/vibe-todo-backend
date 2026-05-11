const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    if (!text) {
      return res.status(400).json({ message: "text는 필수입니다." });
    }

    const todo = await Todo.create({ text });
    return res.status(201).json({
      message: "할일 저장 완료",
      todo,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(500).json({ message: "할일 조회 중 오류가 발생했습니다." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updates = {};

    if (typeof req.body.text === "string") {
      const trimmedText = req.body.text.trim();
      if (!trimmedText) {
        return res.status(400).json({ message: "text는 빈 값일 수 없습니다." });
      }
      updates.text = trimmedText;
    }

    if (typeof req.body.completed === "boolean") {
      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "수정할 값(text 또는 completed)을 보내주세요." });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ message: "해당 할일을 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "할일 수정 완료",
      todo: updatedTodo,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "올바른 할일 ID 형식이 아닙니다." });
    }

    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "해당 할일을 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "할일 삭제 완료",
      todo: deletedTodo,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "올바른 할일 ID 형식이 아닙니다." });
    }

    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
