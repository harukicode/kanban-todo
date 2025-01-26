const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		default: () => Date.now().toString() // Добавляем default значение
	},
	name: {
		type: String,
		required: true
	},
	color: {
		type: String,
		default: '#6b7280'
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);