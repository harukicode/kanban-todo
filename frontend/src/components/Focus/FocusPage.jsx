import MindMap from '@/components/Focus/MindMap.jsx'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Clock, PlayCircle, PauseCircle } from 'lucide-react';

const FocusPage = () => {
	const navigate = useNavigate();
	const [timerMode, setTimerMode] = useState(() => {
		return localStorage.getItem('timerMode') || 'normal';
	});
	const [tasks, setTasks] = useState([]);
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
					setTasks(prevTasks =>
						prevTasks.map(task =>
							task.id === activeTask.id
								? {
									...task,
									timeSpent: (task.timeSpent || 0) + 1,
									sessions: task.sessions.map((session, index) =>
										index === task.sessions.length - 1 ? session + 1 : session
									)
								}
								: task
						)
					);
				}
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRunning, timerMode, activeTask, pomodoroSettings, pomodoroState]);
	
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
			setTasks([...tasks, { id: Date.now(), text: newTask, timeSpent: 0, sessions: [] }]);
			setNewTask('');
		}
	};
	
	const deleteTask = (id) => {
		setTasks(tasks.filter(task => task.id !== id));
		if (activeTask && activeTask.id === id) {
			setActiveTask(null);
		}
	};
	
	const startEditing = (task) => {
		setEditingTask({ ...task });
	};
	
	const saveEdit = () => {
		setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
		setEditingTask(null);
	};
	
	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};
	
	const toggleTimer = () => {
		if (!isRunning && activeTask) {
			setTasks(prevTasks =>
				prevTasks.map(task =>
					task.id === activeTask.id
						? { ...task, sessions: [...task.sessions, 0] }
						: task
				)
			);
		}
		setIsRunning(!isRunning);
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
							{tasks.map(task => (
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
										<Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}><Trash2
											size={16} /></Button>
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
												<PlayCircle className="mr-1 h-4 w-4" /> {/* уменьшены иконки */}
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
									{tasks.map(task => (
										<div key={task.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
											<h3 className="text-lg font-medium text-gray-900">{task.text}</h3>
											<p className="text-sm text-gray-600 mt-1">Total time: {formatTime(task.timeSpent || 0)}</p>
											<div className="mt-2">
												<p className="text-sm font-medium text-gray-700 mb-2">Sessions:</p>
												<div className="grid grid-cols-3 gap-2">
													{task.sessions.map((session, index) => (
														<div
															key={index}
															className="bg-gray-50 rounded-md p-2 border border-gray-100"
														>
															<p className="text-xs font-medium text-gray-600 mb-1">Session {index + 1}</p>
															<p className="text-sm font-mono text-gray-900">{formatTime(session)}</p>
														</div>
													))}
												</div>
											</div>
										</div>
									))}
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
												<label className="block text-sm font-medium text-gray-700 mb-1">Long Break Duration
													(minutes)</label>
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
												<label className="block text-sm font-medium text-gray-700 mb-1">Long Break Interval
													(sessions)</label>
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
				<MindMap/>
			</Card>
			
			</div>
	);
};
			
			export default FocusPage;

