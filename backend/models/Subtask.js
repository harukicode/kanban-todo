// models/Subtask.js
const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
	id: {
		type: String,
		default: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		unique: true,
		index: true
	},
	taskId: {
		type: String,
		required: true,
		index: true
	},
	title: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	completedAt: Date,
	updatedAt: Date
}, {
	timestamps: true
});

// Индексы для оптимизации запросов
subtaskSchema.index({ taskId: 1, completed: 1 });
subtaskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Subtask', subtaskSchema);