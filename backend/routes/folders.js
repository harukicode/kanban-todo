const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');

// Получение всех папок
router.get('/', async (req, res) => {
	try {
		const folders = await Folder.find().sort({ createdAt: 1 });
		res.json(folders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Создание новой папки
router.post('/', async (req, res) => {
	try {
		const folder = new Folder({
			...req.body,
			id: `folder-${Date.now()}`
		});
		const newFolder = await folder.save();
		res.status(201).json(newFolder);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Обновление папки
router.put('/:id', async (req, res) => {
	try {
		const folder = await Folder.findOne({ id: req.params.id });
		if (!folder) {
			return res.status(404).json({ message: 'Folder not found' });
		}
		if (folder.isTaskNotesRoot) {
			return res.status(400).json({ message: 'Cannot modify root folder' });
		}
		
		Object.assign(folder, req.body);
		folder.updatedAt = new Date();
		await folder.save();
		res.json(folder);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Удаление папки
router.delete('/:id', async (req, res) => {
	try {
		const folder = await Folder.findOne({ id: req.params.id });
		if (!folder) {
			return res.status(404).json({ message: 'Folder not found' });
		}
		if (folder.isTaskNotesRoot) {
			return res.status(400).json({ message: 'Cannot delete root folder' });
		}
		
		await Folder.deleteOne({ id: req.params.id });
		res.json({ message: 'Folder deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Создание папки для задачи
router.post('/task-folder', async (req, res) => {
	try {
		const { taskId, taskTitle } = req.body;
		
		// Проверяем существование корневой папки
		let rootFolder = await Folder.findOne({ isTaskNotesRoot: true });
		if (!rootFolder) {
			rootFolder = await new Folder({
				id: 'task-notes-root',
				name: 'Task Notes',
				isTaskNotesRoot: true
			}).save();
		}
		
		// Проверяем существование папки для задачи
		let taskFolder = await Folder.findOne({ taskId });
		if (!taskFolder) {
			const truncatedTitle = taskTitle.length > 20
				? taskTitle.substring(0, 20) + '...'
				: taskTitle;
			
			taskFolder = await new Folder({
				id: `task-folder-${Date.now()}`,
				name: `Task: ${truncatedTitle}`,
				fullName: `Notes for: ${taskTitle}`,
				parentId: rootFolder.id,
				taskId,
				isTaskFolder: true
			}).save();
		}
		
		res.status(201).json(taskFolder);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;