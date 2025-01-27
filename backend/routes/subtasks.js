// routes/subtasks.js
const express = require('express');
const router = express.Router();
const Subtask = require('../models/Subtask');

// Создание нового сабтаска
router.post('/', async (req, res) => {
	try {
		console.log('Received request body:', req.body);
		
		const subtask = new Subtask({
			taskId: req.body.taskId,
			title: req.body.title,
			completed: req.body.completed || false
		});
		
		console.log('Creating subtask:', subtask);
		const newSubtask = await subtask.save();
		console.log('Created subtask:', newSubtask);
		
		res.status(201).json(newSubtask);
	} catch (error) {
		console.error('Error creating subtask:', error);
		res.status(400).json({
			message: error.message,
			details: error.errors
		});
	}
});

// Получение всех сабтасков
router.get('/', async (req, res) => {
	try {
		const subtasks = await Subtask.find().sort({ createdAt: -1 });
		res.json(subtasks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Получение сабтасков для конкретной задачи
router.get('/task/:taskId', async (req, res) => {
	try {
		const subtasks = await Subtask.find({ taskId: req.params.taskId })
			.sort({ createdAt: -1 });
		res.json(subtasks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Обновление сабтаска
router.put('/:id', async (req, res) => {
	try {
		const updates = {
			...req.body,
			updatedAt: new Date()
		};
		
		if (req.body.completed !== undefined) {
			updates.completedAt = req.body.completed ? new Date() : null;
		}
		
		const subtask = await Subtask.findOneAndUpdate(
			{ id: req.params.id },
			updates,
			{ new: true }
		);
		
		if (!subtask) {
			return res.status(404).json({ message: 'Subtask not found' });
		}
		
		res.json(subtask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Удаление сабтаска
router.delete('/:id', async (req, res) => {
	try {
		const subtask = await Subtask.findOneAndDelete({ id: req.params.id });
		if (!subtask) {
			return res.status(404).json({ message: 'Subtask not found' });
		}
		res.json({ message: 'Subtask deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Удаление всех сабтасков задачи
router.delete('/task/:taskId', async (req, res) => {
	try {
		const result = await Subtask.deleteMany({ taskId: req.params.taskId });
		res.json({
			message: 'Subtasks deleted successfully',
			deletedCount: result.deletedCount
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;