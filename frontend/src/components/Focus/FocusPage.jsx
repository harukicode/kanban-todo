import ShortTimeAlert from "@/App/ShortTimeAlert.jsx"
import MindMap from "@/components/Focus/MindMap.jsx"
import TimerCard from "@/components/Focus/TimerCard.jsx"
import { useTimer, useTimerStore } from "@/lib/TimerLib/timerLib.jsx"
import useFocusTaskStore from "@/Stores/FocusTaskStore.jsx"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast.js"

const FocusPage = () => {
	const navigate = useNavigate();
	const {
		focusTasks,
		addFocusTask,
		deleteFocusTask,
		updateFocusTask,
		isLoading,
		error,
		fetchFocusTasks,
	} = useFocusTaskStore();
	
	const {
		time,
		isRunning,
		mode,
		setMode,
		startTimer,
		stopTimer,
		setSelectedTask,
		getFilteredLogs,
		pomodoroSettings,
		updatePomodoroSettings,
		resetPomodoro,
		showModeChangeAlert,
		setShowModeChangeAlert,
		handleConfirmModeChange,
		pendingMode,
	} = useTimer();
	
	const showShortTimeAlert = useTimerStore((state) => state.showShortTimeAlert);
	const setShowShortTimeAlert = useTimerStore((state) => state.setShowShortTimeAlert);
	
	const [newTask, setNewTask] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [activeTask, setActiveTask] = useState(null);
	const [logs, setLogs] = useState([]);
	
	useEffect(() => {
		const initializeTimer = async () => {
			try {
				await useTimerStore.getState().initializeTimer();
			} catch (error) {
				console.error('Error initializing timer:', error);
				toast({
					title: "Error",
					description: "Failed to initialize timer",
					variant: "destructive"
				});
			}
		};
		
		initializeTimer();
		fetchFocusTasks();
	}, [fetchFocusTasks]);
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);
		}
	}, [activeTask, setSelectedTask]);
	
	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const fetchedLogs = await getFilteredLogs({ source: 'focus' });
				setLogs(fetchedLogs);
			} catch (error) {
				console.error('Error fetching logs:', error);
				toast({
					title: "Error",
					description: "Failed to fetch time logs",
					variant: "destructive"
				});
			}
		};
		
		fetchLogs();
		const interval = setInterval(fetchLogs, 30000);
		return () => clearInterval(interval);
	}, [getFilteredLogs]);
	
	const addTask = async () => {
		if (newTask.trim()) {
			try {
				const task = await addFocusTask({
					text: newTask,
				});
				if (task) {
					setNewTask("");
					toast({
						title: "Success",
						description: "Task added successfully"
					});
				}
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to add task",
					variant: "destructive"
				});
			}
		}
	};
	
	const deleteTask = async (id) => {
		try {
			await deleteFocusTask(id);
			if (activeTask && activeTask.id === id) {
				setActiveTask(null);
			}
			toast({
				title: "Success",
				description: "Task deleted successfully"
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete task",
				variant: "destructive"
			});
		}
	};
	
	const startEditing = (task) => {
		setEditingTask({ ...task });
	};
	
	const saveEdit = async () => {
		if (editingTask) {
			try {
				await updateFocusTask(editingTask.id, editingTask);
				setEditingTask(null);
				toast({
					title: "Success",
					description: "Task updated successfully"
				});
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to update task",
					variant: "destructive"
				});
			}
		}
	};
	
	const toggleTimer = async () => {
		try {
			if (!isRunning && activeTask) {
				await startTimer({
					source: "focus",
					taskId: activeTask.id,
					taskName: activeTask.text,
				});
			} else {
				await stopTimer();
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to control timer",
				variant: "destructive"
			});
		}
	};
	
	const switchTimerMode = async () => {
		try {
			await setMode(mode === "normal" ? "pomodoro" : "normal");
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to switch timer mode",
				variant: "destructive"
			});
		}
	};
	
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Card className="p-6">
					<div className="text-red-500">Error: {error}</div>
				</Card>
			</div>
		);
	}
	
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
									disabled={isLoading}
								/>
								<Button
									onClick={addTask}
									variant="default"
									size="icon"
									disabled={isLoading || !newTask.trim()}
								>
									{isLoading ? (
										<span className="animate-spin">⏳</span>
									) : (
										<Plus size={20} />
									)}
								</Button>
							</div>
							<ScrollArea className="flex-1 h-[calc(100%-4rem)] -mx-4">
								<div className="space-y-2 px-4 pb-4">
									{isLoading && focusTasks.length === 0 ? (
										<div className="text-center py-8 text-gray-500">
											Loading tasks...
										</div>
									) : focusTasks.length === 0 ? (
										<div className="text-center py-8 text-gray-500">
											No tasks yet
										</div>
									) : (
										focusTasks.map((task) => (
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
													</div>
												)}
												<div>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => startEditing(task)}
														disabled={isLoading}
													>
														<Edit size={16} />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => deleteTask(task.id)}
														disabled={isLoading}
													>
														<Trash2 size={16} />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => setActiveTask(task)}
														disabled={isLoading}
													>
														<Clock size={16} />
													</Button>
												</div>
											</div>
										))
									)}
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
						logs={logs}
						focusTasks={focusTasks}
						pomodoroSettings={pomodoroSettings}
						updatePomodoroSettings={updatePomodoroSettings}
						showModeChangeAlert={showModeChangeAlert}
						setShowModeChangeAlert={setShowModeChangeAlert}
						handleConfirmModeChange={handleConfirmModeChange}
						pendingMode={pendingMode}
					/>
				</div>
				
				<Card className="flex-1 shadow-md">
					<MindMap
						onAddToTaskList={async (taskText) => {
							try {
								await addFocusTask({
									text: taskText,
								});
								toast({
									title: "Success",
									description: "Task added from mind map"
								});
							} catch (error) {
								toast({
									title: "Error",
									description: "Failed to add task from mind map",
									variant: "destructive"
								});
							}
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