const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Column = require('../models/Column');
const Task = require('../models/Task');

// Получение всех проектов
router.get('/', async (req, res) => {
	try {
		const projects = await Project.find();
		res.json(projects);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Создание нового проекта
router.post('/', async (req, res) => {
	try {
		console.log('Received request body:', req.body);
		const { name, color } = req.body;
		
		if (!name) {
			return res.status(400).json({ message: 'Project name is required' });
		}
		
		const project = new Project({
			id: Date.now().toString(), // Явно устанавливаем id
			name,
			color: color || '#6b7280'
		});
		
		console.log('Creating project:', project);
		const newProject = await project.save();
		console.log('Created project:', newProject);
		
		res.status(201).json(newProject);
	} catch (error) {
		console.error('Error creating project:', error);
		res.status(400).json({
			message: error.message,
			details: error.errors || error.stack
		});
	}
});

// Обновление проекта
// Обновление проекта
router.put('/:id', async (req, res) => {
	try {
		console.log('Updating project:', req.params.id, req.body);
		
		// Используем findOne вместо findOneAndUpdate для лучшего контроля
		const project = await Project.findOne({ id: req.params.id });
		
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		
		// Обновляем только разрешенные поля
		if (req.body.name) project.name = req.body.name;
		if (req.body.color) project.color = req.body.color;
		
		// Сохраняем обновленный проект
		const updatedProject = await project.save();
		console.log('Updated project:', updatedProject);
		
		res.json(updatedProject);
	} catch (error) {
		console.error('Error updating project:', error);
		res.status(400).json({ message: error.message });
	}
});

// Удаление проекта
router.delete('/:id', async (req, res) => {
	try {
		const project = await Project.findOne({ id: req.params.id });
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		
		if (project.isDefault) {
			return res.status(400).json({ message: 'Cannot delete default project' });
		}
		
		const columns = await Column.find({ projectId: req.params.id });
		
		for (const column of columns) {
			await Task.deleteMany({ columnId: column.id });
		}
		
		const columnsDeleteResult = await Column.deleteMany({ projectId: req.params.id });
		
		await Project.deleteOne({ id: req.params.id });
		
		res.json({
			success: true,
			message: 'Project deleted successfully',
			deletedProjectId: req.params.id,
			deletedColumnsCount: columnsDeleteResult.deletedCount
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;