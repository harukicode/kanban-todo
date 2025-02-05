const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	parentId: { type: String, default: null },
	taskId: String,
	fullName: String,
	isTaskNotesRoot: { type: Boolean, default: false },
	isTaskFolder: { type: Boolean, default: false }
}, {
	timestamps: true,
	toJSON: {
		transform: function(doc, ret) {
			ret.createdAt = ret.createdAt.toISOString();
			if (ret.updatedAt) {
				ret.updatedAt = ret.updatedAt.toISOString();
			}
			return ret;
		}
	}
});

// Middleware для автоматической генерации id
folderSchema.pre('save', function(next) {
	if (!this.id) {
		this.id = `folder-${Date.now()}`;
	}
	next();
});

module.exports = mongoose.model('Folder', folderSchema);