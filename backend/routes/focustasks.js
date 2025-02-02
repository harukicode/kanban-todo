const express = require('express');
const router = express.Router();
const FocusTask = require('../models/FocusTask');

// Получение всех задач
router.get('/', async (req, res) => {
	try {
		const tasks = await FocusTask.find().sort({ createdAt: -1 });
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Создание новой задачи
router.post('/', async (req, res) => {
	try {
		const { text } = req.body;
		
		if (!text) {
			return res.status(400).json({ message: 'Text is required' });
		}
		
		const task = new FocusTask({
			id: Date.now().toString(),
			text,
			timeSpent: 0,
			sessions: []
		});
		
		const newTask = await task.save();
		res.status(201).json(newTask);
	} catch (error) {
		console.error('Create task error:', error);
		res.status(400).json({ message: error.message });
	}
});

// Обновление задачи
router.put('/:id', async (req, res) => {
	try {
		const task = await FocusTask.findOne({ id: req.params.id });
		
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		
		const updates = req.body;
		Object.keys(updates).forEach(key => {
			task[key] = updates[key];
		});
		
		const updatedTask = await task.save();
		res.json(updatedTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Удаление задачи
router.delete('/:id', async (req, res) => {
	try {
		const task = await FocusTask.findOneAndDelete({ id: req.params.id });
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.json({ message: 'Task deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;