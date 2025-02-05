const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const columnRoutes = require('./routes/columns');
const projectRoutes = require('./routes/projects');
const subtaskRoutes = require('./routes/subtasks');
const mindMapRoutes = require('./routes/mindmap');
const focusTaskRoutes = require('./routes/focustasks');
const timeLogRoutes = require('./routes/timelogs');
const settingsRoutes = require('./routes/settings');
const notesRoutes = require('./routes/notes');     // Добавляем маршруты для заметок
const foldersRoutes = require('./routes/folders'); // Добавляем маршруты для папок

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS настройка
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5177');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Credentials', 'true');
	
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}
	next();
});

// Basic middleware
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, {
		body: req.body,
		query: req.query
	});
	next();
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/mindmap', mindMapRoutes);
app.use('/api/focustasks', focusTaskRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notes', notesRoutes);     // Добавляем маршруты заметок
app.use('/api/folders', foldersRoutes); // Добавляем маршруты папок

// Базовый маршрут для проверки
app.get('/', (req, res) => {
	res.json({ message: 'API is working!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

// MongoDB connection logging
mongoose.connection.on('connected', async () => {
	console.log('MongoDB connection established');
	try {
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log('Available collections:', collections.map(c => c.name));
	} catch (err) {
		console.error('Error listing collections:', err);
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));