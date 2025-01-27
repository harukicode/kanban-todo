const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const columnRoutes = require('./routes/columns');
const projectRoutes = require('./routes/projects'); // Добавляем новый роутер
const subtaskRoutes = require('./routes/subtasks');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS настройка
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
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

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes); // исправленный путь
app.use('/api/projects', projectRoutes); // Добавляем маршруты проектов
app.use('/api/subtasks', subtaskRoutes);

// Базовый маршрут для проверки
app.get('/', (req, res) => {
	res.json({ message: 'API is working!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message || 'Something went wrong!' });
});
// Добавьте после CORS middleware
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, {
		body: req.body,
		query: req.query
	});
	next();
});

mongoose.connection.on('connected', async () => {
	console.log('MongoDB connection established');
	try {
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log('Available collections:', collections.map(c => c.name));
	} catch (err) {
		console.error('Error listing collections:', err);
	}
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));