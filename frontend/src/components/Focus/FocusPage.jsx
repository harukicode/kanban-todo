import ShortTimeAlert from "@/App/ShortTimeAlert.jsx"
import MindMap from "@/components/Focus/MindMap.jsx"
import TimerCard from "@/components/Focus/TimerCard.jsx"
import { useTimer, useTimerStore } from "@/lib/timerLib.js"
import useFocusTaskStore from "@/Stores/FocusTaskStore.jsx"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2, Clock } from "lucide-react"

const FocusPage = () => {
	const navigate = useNavigate();
	const {
		focusTasks,
		addFocusTask,
		deleteFocusTask,
		updateFocusTask,
	} = useFocusTaskStore();
	
	const {
		time,
		isRunning,
		mode,
		setMode,
		startTimer,
		stopTimer,
		resetTimer,
		setSelectedTask,
		getFilteredLogs,
		pomodoroSettings,
		updatePomodoroSettings,
		formattedTime,
		resetPomodoro,
	} = useTimer();
	
	const showShortTimeAlert = useTimerStore((state) => state.showShortTimeAlert);
	const setShowShortTimeAlert = useTimerStore((state) => state.setShowShortTimeAlert);
	
	const [newTask, setNewTask] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [activeTask, setActiveTask] = useState(null);
	
	
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);
		}
	}, [activeTask, setSelectedTask]);
	
	const addTask = () => {
		if (newTask.trim()) {
			addFocusTask({
				text: newTask,
				timeSpent: 0,
				sessions: [],
			});
			setNewTask("");
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
	
	const formatTimeDisplay = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};
	
	const toggleTimer = () => {
		if (!isRunning && activeTask) {
			startTimer({
				source: "focus",
				taskId: activeTask.id,
				taskName: activeTask.text,
			});
		} else {
			stopTimer();
		}
	};
	
	const switchTimerMode = () => {
		setMode(mode === "normal" ? "pomodoro" : "normal");
	};
	
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 p-4">
			<div className="flex items-center justify-between mb-4">
				<Button
					variant="ghost"
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
					onClick={() => navigate("/kanban")}
				>
					<ArrowLeft size={20} />
					Back to Kanban
				</Button>
				<h1 className="text-2xl font-semibold">Focus Mode</h1>
			</div>
			
			<div className="flex gap-4 h-[calc(100vh-8rem)]">
				<div className="w-[500px] flex flex-col gap-4 min-h-0">
					<Card className="shadow-md flex-1 flex flex-col overflow-hidden h-[calc(100%-200px)]">
						<CardHeader className="border-b py-3">
							<CardTitle className="text-lg">Tasks</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 p-4 h-full overflow-hidden">
							<div className="flex gap-2 mb-4">
								<Input
									type="text"
									placeholder="Add a new task"
									value={newTask}
									onChange={(e) => setNewTask(e.target.value)}
									className="flex-grow"
								/>
								<Button onClick={addTask} variant="default" size="icon">
									<Plus size={20} />
								</Button>
							</div>
							<ScrollArea className="flex-1 h-[calc(100%-4rem)] -mx-4">
								<div className="space-y-2 px-4 pb-4">
									{focusTasks.map((task) => (
										<div
											key={task.id}
											className="flex items-center justify-between p-2 bg-gray-100 rounded"
										>
											{editingTask && editingTask.id === task.id ? (
												<Input
													value={editingTask.text}
													onChange={(e) =>
														setEditingTask({ ...editingTask, text: e.target.value })
													}
													onBlur={saveEdit}
													autoFocus
												/>
											) : (
												<div className="flex flex-col">
													<span>{task.text}</span>
													<span className="text-sm text-gray-500">
                            Time spent: {formatTimeDisplay(task.timeSpent || 0)}
                          </span>
												</div>
											)}
											<div>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => startEditing(task)}
												>
													<Edit size={16} />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => deleteTask(task.id)}
												>
													<Trash2 size={16} />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setActiveTask(task)}
												>
													<Clock size={16} />
												</Button>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
					
					<TimerCard
						timerMode={mode}
						switchTimerMode={switchTimerMode}
						time={time}
						isRunning={isRunning}
						toggleTimer={toggleTimer}
						resetPomodoro={resetPomodoro}
						activeTask={activeTask}
						formatTime={formatTimeDisplay}
						logs={getFilteredLogs().filter((log) => log.source === "focus")}
						focusTasks={focusTasks}
						pomodoroSettings={pomodoroSettings}
						setPomodoroSettings={updatePomodoroSettings}
					/>
				</div>
				
				<Card className="flex-1 shadow-md">
					<MindMap
						onAddToTaskList={(taskText) => {
							addFocusTask({
								text: taskText,
								timeSpent: 0,
								sessions: [],
							});
						}}
					/>
				</Card>
			</div>
			
			<ShortTimeAlert
				isVisible={showShortTimeAlert}
				onClose={() => setShowShortTimeAlert(false)}
			/>
		</div>
	);
};

export default FocusPage;