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
		formattedTime,
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
	
	// Загружаем задачи при монтировании компонента
	useEffect(() => {
		fetchFocusTasks();
	}, [fetchFocusTasks]);
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);
		}
	}, [activeTask, setSelectedTask]);
	
	const addTask = async () => {
		if (newTask.trim()) {
			const task = await addFocusTask({
				text: newTask,
			});
			if (task) {
				setNewTask("");
			}
		}
	};
	
	const deleteTask = async (id) => {
		await deleteFocusTask(id);
		if (activeTask && activeTask.id === id) {
			setActiveTask(null);
		}
	};
	
	const startEditing = (task) => {
		setEditingTask({ ...task });
	};
	
	const saveEdit = async () => {
		if (editingTask) {
			await updateFocusTask(editingTask.id, editingTask);
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
						formatTime={formatTimeDisplay}
						logs={getFilteredLogs().filter((log) => log.source === "focus")}
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
							await addFocusTask({
								text: taskText,
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