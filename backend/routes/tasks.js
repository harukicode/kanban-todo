const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.post('/', async (req, res) => {
	try {
		console.log('Creating task with data:', req.body);
		
		const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const taskData = {
			...req.body,
			id: uniqueId
		};
		
		console.log('Generated unique id:', uniqueId);
		
		const task = new Task(taskData);
		const newTask = await task.save();
		
		console.log('Created task:', newTask);
		res.status(201).json(newTask);
	} catch (error) {
		console.error('Error creating task:', error);
		// Проверяем, является ли ошибка дубликатом
		if (error.code === 11000) {
			return res.status(400).json({
				message: 'Duplicate task ID, please try again',
				error: error.message
			});
		}
		res.status(400).json({
			message: error.message,
			stack: error.stack
		});
	}
});

// Удаление задачи
router.delete('/:id', async (req, res) => {
	try {
		console.log('Deleting task with id:', req.params.id);
		
		const task = await Task.findOne({ id: req.params.id });
		if (!task) {
			console.log('Task not found for deletion');
			return res.status(404).json({ message: 'Task not found' });
		}
		
		const result = await Task.deleteOne({ id: req.params.id });
		console.log('Delete result:', result);
		
		if (result.deletedCount === 0) {
			console.log('Task not deleted');
			return res.status(404).json({ message: 'Task not deleted' });
		}
		
		res.json({
			message: 'Task deleted successfully',
			deletedTaskId: req.params.id
		});
	} catch (error) {
		console.error('Error deleting task:', error);
		res.status(500).json({ message: error.message });
	}
});


router.delete('/:id/comments/:commentId', async (req, res) => {
	try {
		const task = await Task.findOne({ id: req.params.id });
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		
		// Фильтруем комментарии, оставляя все кроме удаляемого
		task.comments = task.comments.filter(
			comment => comment._id.toString() !== req.params.commentId
		);
		
		await task.save();
		res.json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Получение всех задач
router.get('/', async (req, res) => {
	try {
		const tasks = await Task.find().sort({ createdAt: -1 });
		console.log('Found tasks:', tasks.length);
		res.json(tasks);
	} catch (error) {
		console.error('Error fetching tasks:', error);
		res.status(500).json({ message: error.message });
	}
});

// Обновление задачи
router.put('/:id', async (req, res) => {
	try {
		const task = await Task.findOneAndUpdate(
			{ id: req.params.id }, // ищем по id, а не по _id
			req.body,
			{ new: true }
		);
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Добавление временного лога
router.post('/:id/timelog', async (req, res) => {
	try {
		const task = await Task.findOne({ id: req.params.id }); // ищем по id
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		
		task.timeLogs.push(req.body);
		task.timeSpent += req.body.timeSpent;
		
		await task.save();
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Обновление временного лога
router.put('/:id/timelog/:logId', async (req, res) => {
	try {
		const task = await Task.findOne({ id: req.params.id }); // ищем по id
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		
		const timeLog = task.timeLogs.id(req.params.logId);
		if (!timeLog) {
			return res.status(404).json({ message: 'Time log not found' });
		}
		
		Object.assign(timeLog, req.body);
		await task.save();
		res.json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;