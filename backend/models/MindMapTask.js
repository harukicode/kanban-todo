const mongoose = require('mongoose');

const mindMapTaskSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	text: {
		type: String,
		required: true,
		maxLength: 20
	},
	color: {
		type: String,
		required: true
	},
	hoverColor: {
		type: String,
		required: true
	}
}, {
	timestamps: true,
	toJSON: {
		transform: function(doc, ret) {
			ret.id = ret.id; // оставляем id как есть
			delete ret._id; // удаляем _id из ответа
			delete ret.__v; // удаляем версию из ответа
			return ret;
		}
	}
});

mindMapTaskSchema.pre('save', function(next) {
	console.log('Saving task:', this.toObject());
	next();
});

module.exports = mongoose.model('MindMapTask', mindMapTaskSchema);