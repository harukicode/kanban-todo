const mongoose = require('mongoose');

const formattingSchema = new mongoose.Schema({
	bold: { type: Boolean, default: false },
	italic: { type: Boolean, default: false },
	underline: { type: Boolean, default: false },
	strike: { type: Boolean, default: false },
	align: { type: String, default: 'left' },
	size: { type: String, default: 'normal' },
	color: { type: String, default: '#000000' }
});

const commentSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	author: String,
	authorInitial: String,
	updatedAt: Date
});

const noteSchema = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	title: { type: String, required: true },
	content: { type: String, default: '' },
	tags: [String],
	isPinned: { type: Boolean, default: false },
	folderId: String,
	taskId: String,
	formatting: formattingSchema,
	comments: [commentSchema]
}, {
	timestamps: true,
	toJSON: {
		transform: function(doc, ret) {
			ret.createdAt = ret.createdAt.toISOString();
			ret.updatedAt = ret.updatedAt.toISOString();
			return ret;
		}
	}
});

// Middleware для автоматической генерации id
noteSchema.pre('save', function(next) {
	if (!this.id) {
		this.id = Date.now();
	}
	next();
});

module.exports = mongoose.model('Note', noteSchema);