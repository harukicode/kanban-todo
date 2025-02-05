const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Folder = require('../models/Folder');

// Получение всех заметок
router.get('/', async (req, res) => {
	try {
		const notes = await Note.find().sort({ isPinned: -1, updatedAt: -1 });
		res.json(notes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Создание новой заметки
router.post('/', async (req, res) => {
	try {
		const note = new Note({
			...req.body,
			id: Date.now()
		});
		const newNote = await note.save();
		res.status(201).json(newNote);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Создание дубликата заметки
router.post('/duplicate/:id', async (req, res) => {
	try {
		const originalNote = await Note.findOne({ id: req.params.id });
		if (!originalNote) {
			return res.status(404).json({ message: 'Original note not found' });
		}
		
		// Создаем новый объект на основе оригинальной заметки
		const duplicateNote = new Note({
			title: `${originalNote.title} (copy)`,
			content: originalNote.content,
			tags: originalNote.tags,
			folderId: originalNote.folderId,
			taskId: originalNote.taskId,
			formatting: originalNote.formatting,
			comments: [],  // Комментарии не копируем
			isPinned: false,  // Новая заметка не закреплена
			id: Date.now(), // Генерируем новый id
		});
		
		const newNote = await duplicateNote.save();
		res.status(201).json(newNote);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Обновление заметки
router.put('/:id', async (req, res) => {
	try {
		const note = await Note.findOneAndUpdate(
			{ id: req.params.id },
			{ ...req.body, updatedAt: new Date() },
			{ new: true }
		);
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		res.json(note);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Удаление заметки
router.delete('/:id', async (req, res) => {
	try {
		const note = await Note.findOneAndDelete({ id: req.params.id });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		res.json({ message: 'Note deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Работа с тегами
router.post('/:id/tags', async (req, res) => {
	try {
		const { tag } = req.body;
		const note = await Note.findOne({ id: req.params.id });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		if (!note.tags.includes(tag)) {
			note.tags.push(tag);
			note.updatedAt = new Date();
			await note.save();
		}
		res.json(note);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.delete('/:id/tags/:tag', async (req, res) => {
	try {
		const note = await Note.findOne({ id: req.params.id });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		note.tags = note.tags.filter(tag => tag !== req.params.tag);
		note.updatedAt = new Date();
		await note.save();
		res.json(note);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Работа с комментариями
router.post('/:id/comments', async (req, res) => {
	try {
		const note = await Note.findOne({ id: req.params.id });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		const newComment = {
			id: Date.now(),
			...req.body,
			createdAt: new Date()
		};
		note.comments.push(newComment);
		note.updatedAt = new Date();
		await note.save();
		res.status(201).json(note);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.put('/:noteId/comments/:commentId', async (req, res) => {
	try {
		const note = await Note.findOne({ id: req.params.noteId });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		const commentIndex = note.comments.findIndex(
			comment => comment.id.toString() === req.params.commentId
		);
		if (commentIndex === -1) {
			return res.status(404).json({ message: 'Comment not found' });
		}
		note.comments[commentIndex] = {
			...note.comments[commentIndex].toObject(),
			...req.body,
			updatedAt: new Date()
		};
		note.updatedAt = new Date();
		await note.save();
		res.json(note);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.delete('/:noteId/comments/:commentId', async (req, res) => {
	try {
		const note = await Note.findOne({ id: req.params.noteId });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		note.comments = note.comments.filter(
			comment => comment.id.toString() !== req.params.commentId
		);
		note.updatedAt = new Date();
		await note.save();
		res.json(note);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Получение заметок по taskId
router.get('/task/:taskId', async (req, res) => {
	try {
		const notes = await Note.find({ taskId: req.params.taskId })
			.sort({ isPinned: -1, updatedAt: -1 });
		res.json(notes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;