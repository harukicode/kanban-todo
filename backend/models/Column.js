const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	projectId: {
		type: String,
		required: true,
		default: 'default'
	},
	color: {
		type: String,
		default: '#6b7280'
	},
	doneColumn: {
		type: Boolean,
		default: false
	},
	tasks: {
		type: Array,
		default: []
	},
	id: {
		type: String,
		unique: true
	}
}, {
	timestamps: true
});

// Middleware для автоматической генерации id
columnSchema.pre('save', function(next) {
	if (!this.id) {
		this.id = Date.now().toString();
	}
	next();
});

module.exports = mongoose.model('Column', columnSchema);