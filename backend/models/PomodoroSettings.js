const mongoose = require('mongoose');

const pomodoroSettingsSchema = new mongoose.Schema({
	id: {
		type: String,
		default: 'default',
		unique: true
	},
	workTime: {
		type: Number,
		default: 25,
		min: 1,
		max: 60
	},
	shortBreakTime: {
		type: Number,
		default: 5,
		min: 1,
		max: 30
	},
	longBreakTime: {
		type: Number,
		default: 15,
		min: 1,
		max: 60
	},
	longBreakInterval: {
		type: Number,
		default: 4,
		min: 1,
		max: 10
	}
}, {
	timestamps: true,
	toJSON: {
		transform: function(doc, ret) {
			delete ret._id;
			delete ret.__v;
			return ret;
		}
	}
});

module.exports = mongoose.model('PomodoroSettings', pomodoroSettingsSchema);