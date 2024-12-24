// FullTimer.jsx
import ShortTimeAlert from '@/App/ShortTimeAlert.jsx'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GiTomato } from "react-icons/gi";
import { useTimer, useTimerStore } from '@/lib/timerLib'
import useTaskStore from "@/stores/TaskStore";

export default function FullTimer({ onClose }) {
	const {
		time,
		isRunning,
		mode,
		setMode,
		startTimer,
		stopTimer,
		resetTimer,
		selectedTaskId,
		setSelectedTask,
		pomodoroSettings,
		updatePomodoroSettings,
		formattedTime
	} = useTimer();
	
	// Получаем задачи из TaskStore
	const tasks = useTaskStore((state) => state.tasks);
	const showShortTimeAlert = useTimerStore((state) => state.showShortTimeAlert);
	const setShowShortTimeAlert = useTimerStore((state) => state.setShowShortTimeAlert);
	// Находим выбранную задачу
	const selectedTask = tasks.find(task => task.id === selectedTaskId);
	
	// Обработчики
	const handleTimerAction = () => {
		if (isRunning) {
			stopTimer();
		} else if (selectedTaskId) {
			startTimer();
		}
	};
	
	const handlePomodoroChange = (checked) => {
		setMode(checked ? 'pomodoro' : 'stopwatch');
	};
	
	const handleWorkTimeChange = ([value]) => {
		updatePomodoroSettings({
			...pomodoroSettings,
			workTime: value
		});
	};
	
	const handleTaskSelect = (taskId) => {
		setSelectedTask(taskId);
	};
	
	return (
		<>
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold text-foreground">Timer</h2>
				<div className="flex items-center space-x-2">
					<GiTomato className="w-4 h-4" />
					<Switch
						checked={mode === 'pomodoro'}
						onCheckedChange={handlePomodoroChange}
					/>
				</div>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M18 6 6 18"/>
						<path d="m6 6 12 12"/>
					</svg>
					<span className="sr-only">Close</span>
				</Button>
			</div>
			
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<div className="text-4xl font-bold text-foreground">
						{formattedTime}
					</div>
					{selectedTask && (
						<div className="text-sm text-muted-foreground mt-1">
							Total: {selectedTask.timeSpent || 0}
						</div>
					)}
				</div>
				
				<div className="flex flex-col space-y-2">
					<Button
						onClick={handleTimerAction}
						variant={isRunning ? "destructive" : "default"}
						size="sm"
						className="w-20"
						disabled={!selectedTaskId}
					>
						{isRunning ? (
							<Pause className="w-4 h-4 mr-1" />
						) : (
							<Play className="w-4 h-4 mr-1" />
						)}
						{isRunning ? "Pause" : "Start"}
					</Button>
					
					<Button
						onClick={resetTimer}
						variant="outline"
						size="sm"
						className="w-20"
					>
						<RotateCcw className="w-4 h-4 mr-1" />
						Reset
					</Button>
				</div>
			</div>
			
			<div className="flex items-center space-x-2 mt-2">
				<Select
					value={selectedTaskId || ''}
					onValueChange={handleTaskSelect}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a task" />
					</SelectTrigger>
					<SelectContent>
						{tasks.map(task => (
							<SelectItem key={task.id} value={task.id}>
								{task.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				
				{mode === 'pomodoro' && (
					<div className="flex items-center space-x-2 flex-1">
						<Slider
							value={[pomodoroSettings.workTime]}
							onValueChange={handleWorkTimeChange}
							max={60}
							min={1}
							step={1}
							className="w-full"
						/>
						<span className="text-sm font-medium w-12 text-right">
              {pomodoroSettings.workTime} min
            </span>
					</div>
				)}
			</div>
			
			<ShortTimeAlert
				isVisible={showShortTimeAlert}
				onClose={() => setShowShortTimeAlert(false)}
			/>
		</>
	);
}