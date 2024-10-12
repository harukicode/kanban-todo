import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, RotateCcw } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TaskSelect from './TaskSelect';
import TimerFooter from './TimerFooter';
import { useTimer } from '@/hooks/timerHooks/useTimer';

const AddTimer = () => {
	const [settings, setSettings] = useState({
		workTime: 25,
		shortBreakTime: 5,
		longBreakInterval: 4,
		longBreakTime: 15,
	});
	const [currentMode, setCurrentMode] = useState('work');
	const [currentInterval, setCurrentInterval] = useState(1);
	const [isPomodoroMode, setIsPomodoroMode] = useState(false);
	
	const getCurrentDuration = useCallback(() => {
		if (!isPomodoroMode) return 0; // Start from 0 in normal mode
		switch (currentMode) {
			case 'work':
				return settings.workTime * 60;
			case 'shortBreak':
				return settings.shortBreakTime * 60;
			case 'longBreak':
				return settings.longBreakTime * 60;
			default:
				return settings.workTime * 60;
		}
	}, [currentMode, settings, isPomodoroMode]);
	
	const { time, isRunning, handleStartStop, handleReset, updateTime } = useTimer(settings.workTime * 60, !isPomodoroMode);
	
	useEffect(() => {
		updateTime(getCurrentDuration());
	}, [currentMode, settings, updateTime, getCurrentDuration, isPomodoroMode]);
	
	const handleSettingsChange = (newSettings) => {
		setSettings(newSettings);
		if (isPomodoroMode) {
			updateTime(getCurrentDuration());
		}
	};
	
	const handleTimerComplete = useCallback(() => {
		if (!isPomodoroMode) return; // Do nothing in normal mode
		if (currentMode === 'work') {
			if (currentInterval === settings.longBreakInterval) {
				setCurrentMode('longBreak');
				setCurrentInterval(1);
			} else {
				setCurrentMode('shortBreak');
				setCurrentInterval(prev => prev + 1);
			}
		} else {
			setCurrentMode('work');
		}
		updateTime(getCurrentDuration());
	}, [currentMode, currentInterval, settings, isPomodoroMode, updateTime, getCurrentDuration]);
	
	useEffect(() => {
		if (isPomodoroMode && time === 0 && !isRunning) {
			handleTimerComplete();
		}
	}, [time, isRunning, handleTimerComplete, isPomodoroMode]);
	
	const handleTimerModeChange = (newMode) => {
		setIsPomodoroMode(newMode);
		if (newMode) {
			setCurrentMode('work');
			setCurrentInterval(1);
			updateTime(settings.workTime * 60);
		} else {
			handleReset();
		}
	};
	
	return (
		<Card className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
			<CardHeader className="bg-gray-100 border-b border-gray-200">
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold text-gray-800">Timer</CardTitle>
					<div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 shadow-sm">
						<Clock className="h-4 w-4 text-gray-500" />
						<Switch
							checked={isPomodoroMode}
							onCheckedChange={handleTimerModeChange}
							className="data-[state=checked]:bg-green-500"
						/>
						<RotateCcw className="h-4 w-4 text-gray-500" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4">
				<TimerDisplay time={time} isPomodoroMode={isPomodoroMode} />
				<TimerControls
					isRunning={isRunning}
					onStartStop={handleStartStop}
					onReset={handleReset}
				/>
				<TaskSelect />
			</CardContent>
			<CardFooter className="bg-gray-50 border-t border-gray-200 p-2">
				<TimerFooter settings={settings} onSettingsChange={handleSettingsChange} isPomodoroMode={isPomodoroMode} />
			</CardFooter>
		</Card>
	);
};

export default AddTimer;