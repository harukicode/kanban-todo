import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext({
	isSelectingTaskForTimer: false,
	setIsSelectingTaskForTimer: () => {},
	selectedTask: null,
	setSelectedTask: () => {},
	addTimer: false,
	setAddTimer: () => {}
});

export const TimerProvider = ({ children }) => {
	const [isSelectingTaskForTimer, setIsSelectingTaskForTimer] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const [addTimer, setAddTimer] = useState(false);
	
	return (
		<TimerContext.Provider
			value={{
				isSelectingTaskForTimer,
				setIsSelectingTaskForTimer,
				selectedTask,
				setSelectedTask,
				addTimer,
				setAddTimer
			}}
		>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimer = () => {
	const context = useContext(TimerContext);
	if (!context) {
		throw new Error('useTimer must be used within a TimerProvider');
	}
	return context;
};