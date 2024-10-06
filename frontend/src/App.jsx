import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import KanbanBoard from './components/KanbanBoard.jsx';
import TimeTrackerNav from './components/TimeTrackerNav.jsx';
import './app.css';

const App = () => {
	const [activeComponent, setActiveComponent] = useState('Kanban'); // Управляем отображением
	
	return (
		<div className='flex h-screen'>
			<div className='w-1/6 min-w-[200px]'>
				<Sidebar setActiveComponent={setActiveComponent} /> {/* Передаем функцию изменения */}
			</div>
			<div className='flex-grow overflow-auto'>
				{/* Здесь происходит переключение компонентов */}
				{activeComponent === 'Kanban' ? <KanbanBoard /> : <TimeTrackerNav />}
			</div>
		</div>
	);
};

export default App;
