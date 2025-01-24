const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ''
	},
	columnId: {
		type: String,
		required: true
	},
	projectId: {
		type: String
	},
	priority: {
		type: String,
		enum: ['high', 'medium', 'low', 'none', 'None'],
		default: 'none'
	},
	dueDate: {
		type: Date
	},
	timeSpent: {
		type: Number,
		default: 0
	},
	comments: [{
		id: {
			type: String,
			required: true,
			default: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
		},
		content: String,
		author: String,
		createdAt: {
			type: Date,
			default: Date.now
		}
	}],
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: Date,
	timeLogs: [{
		logId: String,
		startTime: Date,
		endTime: Date,
		timeSpent: Number,
		mode: String,
		currentMode: String,
		source: String
	}]
}, {
	timestamps: true
});

// Индекс для быстрого поиска
taskSchema.index({ id: 1, columnId: 1 });

// Перед сохранением генерируем уникальный id
taskSchema.pre('save', function(next) {
	if (!this.id) {
		this.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}
	next();
});

module.exports = mongoose.model('Task', taskSchema);