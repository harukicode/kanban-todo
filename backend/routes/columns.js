const express = require('express');
const router = express.Router();
const Column = require('../models/Column');

// Получение всех колонок
router.get('/', async (req, res) => {
  try {
    const columns = await Column.find().populate('tasks');
    res.json(columns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создание новой колонки
router.post('/', async (req, res) => {
  try {
    console.log('Received column data:', req.body); // Добавляем логирование
    
    const { title, projectId, color } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const column = new Column({
      title,
      projectId: projectId || 'default',
      color: color || '#6b7280',
      tasks: [],
      doneColumn: false
    });
    
    console.log('Creating column:', column); // Добавляем логирование
    
    const newColumn = await column.save();
    console.log('Created column:', newColumn); // Добавляем логирование
    res.status(201).json(newColumn);
  } catch (error) {
    console.error('Error creating column:', error); // Добавляем логирование
    res.status(400).json({
      message: error.message,
      details: error.errors // Добавляем детали ошибки
    });
  }
});

// Обновление колонки
router.put('/:id', async (req, res) => {
  try {
    const column = await Column.findOneAndUpdate(
      { id: req.params.id },
      {
        ...req.body,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    res.json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удаление колонки
router.delete('/:id', async (req, res) => {
  try {
    const column = await Column.findOneAndDelete({ id: req.params.id });
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;