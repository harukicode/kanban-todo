const mongoose = require('mongoose');

const focusTaskSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	text: {
		type: String,
		required: true
	},
	timeSpent: {
		type: Number,
		default: 0
	},
	sessions: [{
		startTime: Date,
		endTime: Date,
		duration: Number
	}]
}, {
	timestamps: true,
	toJSON: {
		transform: function(doc, ret) {
			ret.id = ret.id;
			delete ret._id;
			delete ret.__v;
			return ret;
		}
	}
});

focusTaskSchema.pre('save', function(next) {
	console.log('Saving focus task:', this.toObject());
	next();
});

module.exports = mongoose.model('FocusTask', focusTaskSchema);