import { useState, useEffect } from 'react';

export const useTimer = () => {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	
	useEffect(() => {
		let interval;
		if (isRunning) {
			interval = setInterval(() => {
				setTime(prevTime => prevTime + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRunning]);
	
	const handleStartStop = () => {
		setIsRunning(!isRunning);
	};
	
	const handleReset = () => {
		setIsRunning(false);
		setTime(0);
	};
	
	return { time, isRunning, handleStartStop, handleReset };
};