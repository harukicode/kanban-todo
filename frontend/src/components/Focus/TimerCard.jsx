// TimerCard.jsx
import { TimerModeChangeAlert } from '@/hooks/TimerModeChangeAlert.jsx';
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, PauseCircle, RotateCcw, Loader2 } from 'lucide-react';
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast.js";
import { formatTime } from "@/lib/TimerLib/timerLib.jsx"; // Добавляем импорт formatTime

const TimerCard = ({
	                   timerMode,
	                   switchTimerMode,
	                   time,
	                   isRunning,
	                   toggleTimer,
	                   resetPomodoro,
	                   activeTask,
	                   logs,
	                   focusTasks,
	                   pomodoroSettings,
	                   updatePomodoroSettings,
	                   showModeChangeAlert,
	                   setShowModeChangeAlert,
	                   handleConfirmModeChange,
	                   pendingMode,
                   }) => {
	const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
	const [localLogs, setLocalLogs] = useState(logs);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	
	
	
	
	
	// Обновляем локальное состояние при изменении пропсов
	useEffect(() => {
		// Начальная загрузка логов
		const fetchLogs = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/timelogs?source=focus');
				const data = await response.json();
				setLocalLogs(data);
			} catch (error) {
				console.error('Error fetching logs:', error);
			}
		};
		
		fetchLogs();
		
		// Устанавливаем интервал для периодического обновления
		const interval = setInterval(() => {
			setRefreshTrigger(prev => prev + 1);
		}, 1000); // Обновляем каждую секунду во время работы таймера
		
		return () => clearInterval(interval);
	}, []);
	
	// Добавим эффект для обновления при изменении refreshTrigger
	useEffect(() => {
		if (isRunning || refreshTrigger > 0) {
			const fetchLogs = async () => {
				try {
					const response = await fetch('http://localhost:5000/api/timelogs?source=focus');
					const data = await response.json();
					setLocalLogs(data);
				} catch (error) {
					console.error('Error fetching logs:', error);
				}
			};
			fetchLogs();
		}
	}, [isRunning, refreshTrigger]);
	
	
	
	
	
	const handleTimerAction = async () => {
		setIsLoading(true);
		try {
			await toggleTimer();
			// Немедленно запрашиваем обновленные логи
			const response = await fetch('http://localhost:5000/api/timelogs?source=focus');
			const data = await response.json();
			setLocalLogs(data);
		} catch (error) {
			console.error('Timer action error:', error);
			toast({
				title: "Error",
				description: "Failed to control timer",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<>
			<Card className="shadow-md flex flex-col h-[calc(100%-400px-1rem)]">
				<div className="flex items-center justify-between p-3 border-b">
					<div className="flex items-center gap-2">
						<h2 className="font-semibold text-sm">
							Timer ({timerMode === "normal" ? "Normal" : "Pomodoro"})
						</h2>
						<Button
							onClick={switchTimerMode}
							variant="outline"
							size="sm"
							className="h-7"
							disabled={isRunning}
						>
							Switch Mode
						</Button>
					</div>
				</div>
				
				<Tabs defaultValue="timer" className="flex-1 flex flex-col min-h-0">
					<TabsList className="flex border-b px-3">
						<TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
						<TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
						<TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
					</TabsList>
					
					<div className="flex-1 min-h-0">
						{/* Timer Tab */}
						<TabsContent value="timer" className="h-full p-4 m-0">
							<div className="flex flex-col items-center justify-center h-full space-y-4">
								<div className="text-4xl font-mono tracking-wider">
									{formatTime(time)}
								</div>
								<div className="flex space-x-2">
									<Button
										onClick={handleTimerAction}
										variant={isRunning ? "destructive" : "default"}
										disabled={!activeTask || isLoading}
										className="w-24"
									>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : isRunning ? (
											<>
												<PauseCircle className="mr-2 h-4 w-4" />
												Stop
											</>
										) : (
											<>
												<PlayCircle className="mr-2 h-4 w-4" />
												Start
											</>
										)}
									</Button>
									{timerMode === "pomodoro" && (
										<Button
											onClick={resetPomodoro}
											variant="outline"
											className="w-24"
											disabled={isRunning}
										>
											<RotateCcw className="mr-2 h-4 w-4" />
											Reset
										</Button>
									)}
								</div>
								{activeTask && (
									<div className="w-full p-3 bg-secondary/20 rounded-lg border border-secondary/30">
										<h3 className="font-medium text-sm mb-1">Active Task</h3>
										<p className="text-sm text-secondary-foreground/80">
											{activeTask.text}
										</p>
									</div>
								)}
							</div>
						</TabsContent>
						
						{/* Logs Tab */}
						<TabsContent value="logs" className="h-full m-0 relative">
							<ScrollArea className="h-[calc(100%-1rem)] absolute inset-0 p-4">
								<div className="space-y-2">
									{!localLogs ? (
										<div className="flex items-center justify-center py-8">
											<Loader2 className="h-6 w-6 animate-spin text-gray-500" />
										</div>
									) : localLogs.length === 0 ? (
										<div className="text-center text-gray-500 py-4">
											No logs yet
										</div>
									) : [...localLogs].reverse().map(log => (
										<div
											key={log.logId}
											className="flex items-center justify-between p-3 hover:bg-gray-50 border rounded-lg"
										>
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm truncate">
													{log.taskName}
												</div>
												<div className="text-xs text-gray-500">
													{format(new Date(log.startTime), "MMM dd, yyyy HH:mm")} -{" "}
													{format(new Date(log.endTime), "HH:mm")}
												</div>
											</div>
											<div className="flex flex-col items-end gap-1 shrink-0">
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
									))}
								</div>
							</ScrollArea>
						</TabsContent>

						
						{/* Settings Tab */}
						<TabsContent value="settings" className="h-full m-0 relative">
							<ScrollArea className="h-[calc(100%-1rem)] absolute inset-0 p-4">
								<div className="space-y-4">
									<div className="bg-white rounded-lg p-4 border">
										<label
											htmlFor="work-duration"
											className="text-sm font-medium block mb-2"
										>
											Work Duration (minutes)
										</label>
										<Input
											id="work-duration"
											type="number"
											value={pomodoroSettings.workTime}
											onChange={async (e) => {
												const value = Number(e.target.value);
												if (!isNaN(value)) {
													await handleSettingsUpdate({
														...pomodoroSettings,
														workTime: Math.min(60, Math.max(1, value))
													});
												}
											}}
											min="1"
											max="60"
											disabled={isUpdatingSettings}
										/>
									</div>
									
									<div className="bg-white rounded-lg p-4 border">
										<label
											htmlFor="break-duration"
											className="text-sm font-medium block mb-2"
										>
											Break Duration (minutes)
										</label>
										<Input
											id="break-duration"
											type="number"
											value={pomodoroSettings.shortBreakTime}
											onChange={async (e) => {
												const value = Number(e.target.value);
												if (!isNaN(value)) {
													await handleSettingsUpdate({
														...pomodoroSettings,
														shortBreakTime: Math.min(30, Math.max(1, value))
													});
												}
											}}
											min="1"
											max="30"
											disabled={isUpdatingSettings}
										/>
									</div>
									
									<div className="bg-white rounded-lg p-4 border">
										<label
											htmlFor="long-break-duration"
											className="text-sm font-medium block mb-2"
										>
											Long Break Duration (minutes)
										</label>
										<Input
											id="long-break-duration"
											type="number"
											value={pomodoroSettings.longBreakTime}
											onChange={async (e) => {
												const value = Number(e.target.value);
												if (!isNaN(value)) {
													await handleSettingsUpdate({
														...pomodoroSettings,
														longBreakTime: Math.min(60, Math.max(1, value))
													});
												}
											}}
											min="1"
											max="60"
											disabled={isUpdatingSettings}
										/>
									</div>
									
									<div className="bg-white rounded-lg p-4 border">
										<label
											htmlFor="break-interval"
											className="text-sm font-medium block mb-2"
										>
											Long Break Interval (sessions)
										</label>
										<Input
											id="break-interval"
											type="number"
											value={pomodoroSettings.longBreakInterval}
											onChange={async (e) => {
												const value = Number(e.target.value);
												if (!isNaN(value)) {
													await handleSettingsUpdate({
														...pomodoroSettings,
														longBreakInterval: Math.min(10, Math.max(1, value))
													});
												}
											}}
											min="1"
											max="10"
											disabled={isUpdatingSettings}
										/>
									</div>
									
									{isUpdatingSettings && (
										<div className="flex items-center justify-center">
											<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
											<span className="ml-2 text-sm text-gray-500">Updating settings...</span>
										</div>
									)}
								</div>
							</ScrollArea>
						</TabsContent>
					</div>
				</Tabs>
			</Card>
			
			<TimerModeChangeAlert
				isOpen={showModeChangeAlert}
				onOpenChange={setShowModeChangeAlert}
				onConfirm={handleConfirmModeChange}
				currentMode={timerMode}
				newMode={pendingMode}
			/>
		</>
	);
};

export default TimerCard;