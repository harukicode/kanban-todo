const express = require('express');
const router = express.Router();
const MindMapTask = require('../models/MindMapTask');

// Получение всех задач
router.get('/', async (req, res) => {
	try {
		const tasks = await MindMapTask.find().sort({ createdAt: -1 });
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Создание новой задачи
router.post('/', async (req, res) => {
	try {
		const { text, color, hoverColor, id } = req.body;
		
		if (!text || !color || !hoverColor || !id) {
			return res.status(400).json({
				message: 'All fields are required',
				received: { text, color, hoverColor, id }
			});
		}
		
		const task = new MindMapTask({
			id,
			text: text.slice(0, 20),
			color,
			hoverColor
		});
		
		console.log('Creating task:', task);
		
		const newTask = await task.save();
		res.status(201).json(newTask);
	} catch (error) {
		console.error('Error creating task:', error);
		res.status(400).json({
			message: error.message,
			details: error.errors
		});
	}
});

// Удаление задачи
router.delete('/:id', async (req, res) => {
	try {
		const task = await MindMapTask.findOneAndDelete({ id: req.params.id });
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.json({ message: 'Task deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;