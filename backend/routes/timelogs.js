const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');
const PomodoroSettings = require('../models/PomodoroSettings');
const Task = require('../models/Task');
const FocusTask = require('../models/FocusTask');

// Получение всех логов с фильтрацией
router.get('/', async (req, res) => {
	try {
		const {
			startDate,
			endDate,
			source,
			mode,
			taskId
		} = req.query;
		
		const query = {};
		
		if (startDate || endDate) {
			query.startTime = {};
			if (startDate) query.startTime.$gte = new Date(startDate);
			if (endDate) query.startTime.$lte = new Date(endDate);
		}
		
		if (source) query.source = source;
		if (mode) query.mode = mode;
		if (taskId) query.taskId = taskId;
		
		const logs = await TimeLog.find(query).sort({ startTime: -1 });
		res.json(logs);
	} catch (error) {
		res.status(500).json({
			message: error.message,
			stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}
});

// Создание нового лога
router.post('/', async (req, res) => {
	try {
		const timeLog = new TimeLog(req.body);
		const savedLog = await timeLog.save();
		
		// Обновляем время в соответствующей задаче
		if (timeLog.source === 'focus') {
			await FocusTask.findOneAndUpdate(
				{ id: timeLog.taskId },
				{ $inc: { timeSpent: timeLog.timeSpent } }
			);
		} else {
			await Task.findOneAndUpdate(
				{ id: timeLog.taskId },
				{ $inc: { timeSpent: timeLog.timeSpent } }
			);
		}
		
		res.status(201).json(savedLog);
	} catch (error) {
		res.status(400).json({
			message: error.message,
			stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}
});

// Обновление лога
router.put('/:logId', async (req, res) => {
	try {
		const oldLog = await TimeLog.findOne({ logId: req.params.logId });
		if (!oldLog) {
			return res.status(404).json({ message: 'Time log not found' });
		}
		
		// Вычисляем разницу в timeSpent
		const timeDiff = (req.body.timeSpent || oldLog.timeSpent) - oldLog.timeSpent;
		
		const updatedLog = await TimeLog.findOneAndUpdate(
			{ logId: req.params.logId },
			req.body,
			{ new: true }
		);
		
		// Обновляем общее время в задаче
		if (oldLog.source === 'focus') {
			await FocusTask.findOneAndUpdate(
				{ id: oldLog.taskId },
				{ $inc: { timeSpent: timeDiff } }
			);
		} else {
			await Task.findOneAndUpdate(
				{ id: oldLog.taskId },
				{ $inc: { timeSpent: timeDiff } }
			);
		}
		
		res.json(updatedLog);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Удаление лога
router.delete('/:logId', async (req, res) => {
	try {
		const log = await TimeLog.findOne({ logId: req.params.logId });
		if (!log) {
			return res.status(404).json({ message: 'Time log not found' });
		}
		
		// Вычитаем время из задачи перед удалением лога
		if (log.source === 'focus') {
			await FocusTask.findOneAndUpdate(
				{ id: log.taskId },
				{ $inc: { timeSpent: -log.timeSpent } }
			);
		} else {
			await Task.findOneAndUpdate(
				{ id: log.taskId },
				{ $inc: { timeSpent: -log.timeSpent } }
			);
		}
		
		await TimeLog.deleteOne({ logId: req.params.logId });
		res.json({ message: 'Time log deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Получение статистики за период
router.get('/stats', async (req, res) => {
	try {
		const { startDate, endDate, source } = req.query;
		
		const query = {};
		if (startDate || endDate) {
			query.startTime = {};
			if (startDate) query.startTime.$gte = new Date(startDate);
			if (endDate) query.startTime.$lte = new Date(endDate);
		}
		if (source) query.source = source;
		
		const logs = await TimeLog.find(query);
		
		const stats = {
			totalTime: logs.reduce((sum, log) => sum + log.timeSpent, 0),
			totalSessions: logs.length,
			pomodoroSessions: logs.filter(log => log.mode === 'pomodoro').length,
			stopwatchSessions: logs.filter(log => log.mode === 'stopwatch').length,
			byTask: {}
		};
		
		// Группировка по задачам
		logs.forEach(log => {
			if (!stats.byTask[log.taskId]) {
				stats.byTask[log.taskId] = {
					taskName: log.taskName,
					totalTime: 0,
					sessions: 0
				};
			}
			stats.byTask[log.taskId].totalTime += log.timeSpent;
			stats.byTask[log.taskId].sessions += 1;
		});
		
		res.json(stats);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;