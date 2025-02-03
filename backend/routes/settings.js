const express = require('express');
const router = express.Router();
const PomodoroSettings = require('../models/PomodoroSettings');

// Получение настроек
router.get('/pomodoro', async (req, res) => {
	try {
		let settings = await PomodoroSettings.findOne({ id: 'default' });
		if (!settings) {
			settings = await PomodoroSettings.create({ id: 'default' });
		}
		res.json(settings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Обновление настроек
router.put('/pomodoro', async (req, res) => {
	try {
		const settings = await PomodoroSettings.findOneAndUpdate(
			{ id: 'default' },
			req.body,
			{ new: true, upsert: true }
		);
		res.json(settings);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;