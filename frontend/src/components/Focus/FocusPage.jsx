import MindMap from '@/components/Focus/MindMap.jsx'
import { useTimer, useTimerStore } from '@/lib/timerLib.js'
import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Clock, PlayCircle, PauseCircle } from 'lucide-react';
import { format } from "date-fns";

const FocusPage = () => {
	const navigate = useNavigate();
	const {
		focusTasks,
		addFocusTask,
		deleteFocusTask,
		updateFocusTask,
	} = useFocusTaskStore();
	
	const {
		startTimer,
		stopTimer,
		setSelectedTask,
		getFilteredLogs
	} = useTimer();
	
	const [timerMode, setTimerMode] = useState(() => {
		return localStorage.getItem('timerMode') || 'normal';
	});
	
	const [newTask, setNewTask] = useState('');
	const [editingTask, setEditingTask] = useState(null);
	const [time, setTime] = useState(() => {
		return timerMode === 'normal' ? 0 : 25 * 60;
	});
	const [isRunning, setIsRunning] = useState(false);
	const [activeTask, setActiveTask] = useState(null);
	const [pomodoroSettings, setPomodoroSettings] = useState({
		workDuration: 25,
		breakDuration: 5,
		longBreakDuration: 15,
		longBreakInterval: 4
	});
	const [pomodoroState, setPomodoroState] = useState({
		currentSession: 'work',
		sessionsCompleted: 0
	});
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);
		}
	}, [activeTask, setSelectedTask]);
	
	useEffect(() => {
		let interval;
		if (isRunning) {
			interval = setInterval(() => {
				if (timerMode === 'normal') {
					setTime(prevTime => prevTime + 1);
				} else {
					setTime(prevTime => {
						if (prevTime > 0) {
							return prevTime - 1;
						} else {
							handlePomodoroStateChange();
							return 0;
						}
					});
				}
				if (activeTask) {
					updateFocusTask(activeTask.id, {
						...activeTask,
						timeSpent: (activeTask.timeSpent || 0) + 1,
						sessions: activeTask.sessions.map((session, index) =>
							index === activeTask.sessions.length - 1
								? (typeof session === 'number' ? session + 1 : { ...session, duration: session.duration + 1 })
								: session
						)
					});
				}
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRunning, timerMode, activeTask, updateFocusTask]);
	
	const handlePomodoroStateChange = () => {
		setPomodoroState(prevState => {
			const newState = { ...prevState };
			if (prevState.currentSession === 'work') {
				newState.sessionsCompleted += 1;
				if (newState.sessionsCompleted % pomodoroSettings.longBreakInterval === 0) {
					newState.currentSession = 'longBreak';
					setTime(pomodoroSettings.longBreakDuration * 60);
				} else {
					newState.currentSession = 'break';
					setTime(pomodoroSettings.breakDuration * 60);
				}
			} else {
				newState.currentSession = 'work';
				setTime(pomodoroSettings.workDuration * 60);
			}
			return newState;
		});
	};
	
	const addTask = () => {
		if (newTask.trim()) {
			addFocusTask({
				text: newTask,
				timeSpent: 0,
				sessions: []
			});
			setNewTask('');
		}
	};
	
	const deleteTask = (id) => {
		deleteFocusTask(id);
		if (activeTask && activeTask.id === id) {
			setActiveTask(null);
		}
	};
	
	const startEditing = (task) => {
		setEditingTask({ ...task });
	};
	
	const saveEdit = () => {
		if (editingTask) {
			updateFocusTask(editingTask.id, editingTask);
			setEditingTask(null);
		}
	};
	
	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);  // Используем функцию из хука useTimer
		}
	}, [activeTask, setSelectedTask]);
	
	const toggleTimer = () => {
		if (!isRunning && activeTask) {
			console.log('Starting timer for active task:', activeTask);
			
			// Сначала устанавливаем активную задачу
			setSelectedTask(activeTask.id);
			
			// Запускаем таймер с правильными опциями
			startTimer({
				source: 'focus',
				taskId: activeTask.id,
				taskName: activeTask.text
			});
			
			console.log('Timer started with options:', {
				source: 'focus',
				taskId: activeTask.id,
				taskName: activeTask.text
			});
			
			setIsRunning(true);
		} else {
			console.log('Stopping timer');
			stopTimer();
			setIsRunning(false);
		}
	};
	
	const resetTimer = () => {
		setTime(timerMode === 'normal' ? 0 : pomodoroSettings.workDuration * 60);
		setIsRunning(false);
		setPomodoroState({ currentSession: 'work', sessionsCompleted: 0 });
	};
	
	const switchTimerMode = () => {
		setTimerMode(prevMode => {
			const newMode = prevMode === 'normal' ? 'pomodoro' : 'normal';
			setTime(newMode === 'normal' ? 0 : pomodoroSettings.workDuration * 60);
			setIsRunning(false);
			setPomodoroState({ currentSession: 'work', sessionsCompleted: 0 });
			return newMode;
		});
	};
	
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 p-4">
			<div className="flex items-center justify-between mb-4">
				<Button
					variant="ghost"
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
					onClick={() => navigate('/kanban')}
				>
					<ArrowLeft size={20} />
					Back to Kanban
				</Button>
				<h1 className="text-2xl font-semibold">Focus Mode</h1>
			</div>
			
			<div className="flex gap-4 h-[calc(40vh-2rem)]">
				<Card className="w-1/2 shadow-md">
					<CardHeader>
						<CardTitle>Tasks</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex mb-4">
							<Input
								type="text"
								placeholder="Add a new task"
								value={newTask}
								onChange={(e) => setNewTask(e.target.value)}
								className="flex-grow mr-2"
							/>
							<Button onClick={addTask}><Plus size={20} /></Button>
						</div>
						<ScrollArea className="h-[calc(40vh-12rem)]">
							{focusTasks.map(task => (
								<div key={task.id} className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded">
									{editingTask && editingTask.id === task.id ? (
										<Input
											value={editingTask.text}
											onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
											onBlur={saveEdit}
											autoFocus
										/>
									) : (
										<div className="flex flex-col">
											<span>{task.text}</span>
											<span className="text-sm text-gray-500">Time spent: {formatTime(task.timeSpent || 0)}</span>
										</div>
									)}
									<div>
										<Button variant="ghost" size="icon" onClick={() => startEditing(task)}><Edit size={16} /></Button>
										<Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}><Trash2 size={16} /></Button>
										<Button variant="ghost" size="icon" onClick={() => setActiveTask(task)}><Clock size={16} /></Button>
									</div>
								</div>
							))}
						</ScrollArea>
					</CardContent>
				</Card>
				
				<Card className="w-1/2 shadow-md">
					<CardHeader>
						<CardTitle className="flex justify-between items-center">
							<span>Timer ({timerMode === 'normal' ? 'Normal' : 'Pomodoro'})</span>
							<Button onClick={switchTimerMode}>Switch Mode</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="timer" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="timer">Timer</TabsTrigger>
								<TabsTrigger value="logs">Logs</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
							</TabsList>
							
							<TabsContent value="timer" className="flex flex-col items-center space-y-4">
								<div className="text-5xl font-mono tracking-wider">{formatTime(time)}</div>
								<div className="flex gap-2">
									<Button
										size="sm"
										onClick={toggleTimer}
										className="min-w-[100px]"
									>
										{isRunning ? (
											<>
												<PauseCircle className="mr-1 h-4 w-4" />
												Pause
											</>
										) : (
											<>
												<PlayCircle className="mr-1 h-4 w-4" />
												Start
											</>
										)}
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={resetTimer}
										className="min-w-[100px]"
									>
										Reset
									</Button>
								</div>
								{activeTask && (
									<div className="w-full max-w-sm p-2 bg-secondary/20 rounded-lg border border-secondary/30">
										<h3 className="font-semibold text-base mb-1 text-secondary-foreground">Active Task</h3>
										<p className="text-sm text-secondary-foreground/80">{activeTask.text}</p>
									</div>
								)}
							</TabsContent>
							
							<TabsContent value="logs">
								<ScrollArea className="h-[200px]">
									<div className="space-y-1">
										{(() => {
											// Получаем все логи для отладки
											const allLogs = getFilteredLogs();
											console.log('All logs:', allLogs);
											
											// Получаем только логи focus mode
											const focusLogs = allLogs.filter(log => log.source === 'focus');
											console.log('Focus logs:', focusLogs);
											
											// Добавляем актуальные названия задач
											const logsWithNames = focusLogs.map(log => {
												const focusTask = focusTasks.find(task => task.id === log.taskId);
												console.log('Found task for log:', log.taskId, focusTask);
												return {
													...log,
													taskName: focusTask ? focusTask.text : log.taskName
												};
											}).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
											
											console.log('Final logs to display:', logsWithNames);
											
											if (logsWithNames.length === 0) {
												return (
													<div className="text-center py-8 text-gray-500">
														No logs yet
													</div>
												);
											}
											
											return logsWithNames.map(log => (
												<div
													key={log.logId}
													className="flex items-center justify-between p-3 hover:bg-gray-50 border-b"
												>
													<div className="flex-1">
														<div className="font-medium">{log.taskName}</div>
														<div className="text-sm text-gray-500">
															{format(new Date(log.startTime), "MMM dd, yyyy HH:mm")} -
															{format(new Date(log.endTime), "HH:mm")}
														</div>
													</div>
													<div className="flex items-center gap-4">
														<div className="flex flex-col items-end">
															<div className="text-sm font-medium">
																{formatTime(log.timeSpent)}
															</div>
															<div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {log.mode === "pomodoro"
	                    ? `Pomodoro - ${log.currentMode}`
	                    : "Stopwatch"}
                  </span>
																<span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Focus Mode
                  </span>
															</div>
														</div>
													</div>
												</div>
											));
										})()}
									</div>
								</ScrollArea>
							</TabsContent>
							
							<TabsContent value="settings">
								<ScrollArea className="h-[200px]">
									<div className="space-y-4 p-4">
										<div className="bg-white rounded-lg shadow-sm p-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Work Duration (minutes)</label>
												<Input
													type="number"
													value={pomodoroSettings.workDuration}
													onChange={(e) => setPomodoroSettings(prev => ({
														...prev,
														workDuration: parseInt(e.target.value)
													}))}
													min="1"
													max="60"
												/>
											</div>
										</div>
										
										<div className="bg-white rounded-lg shadow-sm p-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (minutes)</label>
												<Input
													type="number"
													value={pomodoroSettings.breakDuration}
													onChange={(e) => setPomodoroSettings(prev => ({
														...prev,
														breakDuration: parseInt(e.target.value)
													}))}
													min="1"
													max="30"
												/>
											</div>
										</div>
										
										<div className="bg-white rounded-lg shadow-sm p-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Long Break Duration (minutes)</label>
												<Input
													type="number"
													value={pomodoroSettings.longBreakDuration}
													onChange={(e) => setPomodoroSettings(prev => ({
														...prev,
														longBreakDuration: parseInt(e.target.value)
													}))}
													min="1"
													max="60"
												/>
											</div>
										</div>
										
										<div className="bg-white rounded-lg shadow-sm p-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Long Break Interval (sessions)</label>
												<Input
													type="number"
													value={pomodoroSettings.longBreakInterval}
													onChange={(e) => setPomodoroSettings(prev => ({
														...prev,
														longBreakInterval: parseInt(e.target.value)
													}))}
													min="1"
													max="10"
												/>
											</div>
										</div>
									</div>
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
			
			<Card className="mt-4 shadow-md h-[calc(50vh-2rem)]">
				<MindMap onAddToTaskList={(taskText) => {
					addFocusTask({
						text: taskText,
						timeSpent: 0,
						sessions: []
					});
				}}/>
			</Card>
		</div>
	);
};

export default FocusPage;