import { useState } from 'react';

export const useTimerLog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [logs, setLogs] = useState([]);
	
	const handleDeleteLog = (index) => {
		const newLogs = [...logs];
		newLogs.splice(index, 1);
		setLogs(newLogs);
	};
	
	return { isOpen, setIsOpen, logs, handleDeleteLog };
};