const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
	logId: {
		type: String,
		required: true,
		unique: true,
		default: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	},
	taskId: {
		type: String,
		required: true,
		index: true
	},
	taskName: {
		type: String,
		required: true
	},
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		required: true
	},
	timeSpent: {
		type: Number,
		required: true,
		default: 0
	},
	mode: {
		type: String,
		enum: ['pomodoro', 'stopwatch'],
		required: true
	},
	currentMode: {
		type: String,
		enum: ['work', 'shortBreak', 'longBreak'],
		default: 'work'
	},
	source: {
		type: String,
		enum: ['timer', 'focus'],
		required: true
	}
}, {
	timestamps: true,
	toJSON: {
		transform: function(doc, ret) {
			ret.logId = ret.logId;
			delete ret._id;
			delete ret.__v;
			return ret;
		}
	}
});

// Индексы для оптимизации запросов
timeLogSchema.index({ taskId: 1, startTime: -1 });
timeLogSchema.index({ source: 1, startTime: -1 });

module.exports = mongoose.model('TimeLog', timeLogSchema);