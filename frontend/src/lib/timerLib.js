import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx'
import useTaskStore from '@/Stores/TaskStore.jsx'
import React from 'react'
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const formatTime = (timeInSeconds) => {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = timeInSeconds % 60;
	return `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const useTimerStore = create(
	persist(
		(set, get) => ({
			showShortTimeAlert: false,  // Add this
			setShowShortTimeAlert: (show) => set({ showShortTimeAlert: show }), // Add this
			isRunning: false,
			time: 0,
			mode: "stopwatch",
			startTime: null,
			currentLogId: null,
			selectedTaskId: null,
			currentSource: null,
			// Добавляем отслеживание текущего источника
			
			pomodoroSettings: {
				workTime: 25,
				shortBreakTime: 5,
				longBreakTime: 15,
				longBreakInterval: 4,
			},
			currentMode: "work",
			currentInterval: 1,
			
			timeLogs: [],
			
			getCurrentPomodoroTime: () => {
				const state = get();
				if (state.mode !== 'pomodoro') return 0;
				
				switch (state.currentMode) {
					case 'work':
						return state.pomodoroSettings.workTime * 60;
					case 'shortBreak':
						return state.pomodoroSettings.shortBreakTime * 60;
					case 'longBreak':
						return state.pomodoroSettings.longBreakTime * 60;
					default:
						return state.pomodoroSettings.workTime * 60;
				}
			},
			
			// Действия с таймером
			// В useTimerStore
// timerLib.js
			startTimer: (options = { source: 'timer' }) => {
				const now = new Date();
				const state = get();
				const selectedTaskId = options.taskId || state.selectedTaskId;
				
				if (selectedTaskId) {
					// Определяем название задачи в зависимости от источника
					let taskName;
					if (options.source === 'focus') {
						const focusTaskStore = useFocusTaskStore.getState();
						const focusTask = focusTaskStore.getFocusTaskById(selectedTaskId);
						taskName = focusTask ? focusTask.text : "Unknown Task";
					} else {
						const taskStore = useTaskStore.getState();
						const task = taskStore.tasks.find(t => t.id === selectedTaskId);
						taskName = task ? task.title : "Unknown Task";
					}
					
					const logEntry = {
						logId: Date.now().toString(),
						taskId: selectedTaskId,
						taskName: taskName,
						startTime: now.toISOString(),
						endTime: now.toISOString(),
						timeSpent: 0,
						mode: state.mode,
						currentMode: state.currentMode,
						source: options.source
					};
					
					set(state => ({
						isRunning: true,
						startTime: now.toISOString(),
						currentLogId: logEntry.logId,
						timeLogs: [...state.timeLogs, logEntry],
						selectedTaskId: selectedTaskId,
						currentSource: options.source
					}));
				}
			},
			
			stopTimer: () => {
				const state = get();
				if (state.startTime && state.selectedTaskId) {
					const endTime = new Date();
					const startTime = new Date(state.startTime);
					
					// Теперь используем функцию из store
					const timeSpent = state.mode === 'pomodoro'
						? state.getCurrentPomodoroTime() - state.time
						: state.time;
					
					if (timeSpent < 10) {
						set({
							showShortTimeAlert: true,
							isRunning: false,
							startTime: null,
							time: 0,
							currentLogId: null,
							currentSource: null,
							timeLogs: state.timeLogs.filter(log => log.logId !== state.currentLogId)
						});
						return;
					}
					
					const updatedLog = {
						endTime: endTime.toISOString(),
						timeSpent
					};
					
					// Обновляем задачу в соответствующем сторе
					if (state.currentSource === 'focus') {
						const focusTaskStore = useFocusTaskStore.getState();
						const task = focusTaskStore.getFocusTaskById(state.selectedTaskId);
						if (task) {
							focusTaskStore.updateFocusTask(state.selectedTaskId, {
								...task,
								timeSpent: (task.timeSpent || 0) + timeSpent
							});
						}
					}
					
					// Обновляем лог
					set(state => ({
						isRunning: false,
						startTime: null,
						time: 0,
						timeLogs: state.timeLogs.map((log) =>
							log.logId === state.currentLogId
								? { ...log, ...updatedLog }
								: log
						),
						currentLogId: null,
						currentSource: null
					}));
				}
			},
			
			// Управление режимами
			setMode: (mode) => {
				set({
					mode,
					time: 0,
					currentMode: "work",
					currentInterval: 1,
					isRunning: false,
				});
			},
			
			updatePomodoroSettings: (newSettings) => {
				set((state) => ({
					pomodoroSettings: {
						...state.pomodoroSettings,
						...newSettings,
					},
				}));
			},
			
			handlePomodoroComplete: () => {
				const state = get();
				if (state.mode !== 'pomodoro') return;
				
				let nextMode;
				let nextInterval = state.currentInterval;
				
				if (state.currentMode === 'work') {
					if (state.currentInterval === state.pomodoroSettings.longBreakInterval) {
						nextMode = 'longBreak';
						nextInterval = 1;
					} else {
						nextMode = 'shortBreak';
						nextInterval = state.currentInterval + 1;
					}
				} else {
					nextMode = 'work';
				}
				
				set({
					currentMode: nextMode,
					currentInterval: nextInterval,
					isRunning: false,
				});
			},
			
			// Работа со временем
			updateTime: (newTime) => {
				set({ time: newTime });
			},
			
			getCurrentDuration: () => {
				const state = get();
				if (state.mode !== "pomodoro") return state.time;
				
				switch (state.currentMode) {
					case "work":
						return state.pomodoroSettings.workTime * 60;
					case "shortBreak":
						return state.pomodoroSettings.shortBreakTime * 60;
					case "longBreak":
						return state.pomodoroSettings.longBreakTime * 60;
					default:
						return state.pomodoroSettings.workTime * 60;
				}
			},
			
			// Работа с задачами
			setSelectedTask: (taskId) => {
				set({ selectedTaskId: taskId });
			},
			
			// Работа с логами
			addTimeLog: (log) => {
				set((state) => ({
					timeLogs: [...state.timeLogs, log],
				}));
			},
			
			updateTimeLog: (logId, updatedData) => {
				set(state => ({
					timeLogs: state.timeLogs.map(log =>
						log.logId === logId ? { ...log, ...updatedData } : log
					),
				}));
			},
			
			deleteTimeLog: (logId) => {
				set(state => ({
					timeLogs: state.timeLogs.filter(log => log.logId !== logId),
				}));
			},
			
			getFilteredLogs: (filters = {}) => {
				const state = get();
				return state.timeLogs.filter((log) => {
					// Базовые фильтры
					if (filters.taskId && log.taskId !== filters.taskId) return false;
					if (filters.startDate && new Date(log.startTime) < new Date(filters.startDate)) return false;
					if (filters.endDate && new Date(log.endTime) > new Date(filters.endDate)) return false;
					if (filters.mode && log.mode !== filters.mode) return false;
					if (filters.source && log.source !== filters.source) return false;
					
					// Обновляем имя задачи, если оно отсутствует
					if (!log.taskName || log.taskName === "Unknown Task") {
						if (log.source === 'focus') {
							const focusTaskStore = useFocusTaskStore.getState();
							const focusTask = focusTaskStore.getFocusTaskById(log.taskId);
							if (focusTask) {
								log.taskName = focusTask.text;
							}
						} else {
							const taskStore = useTaskStore.getState();
							const task = taskStore.tasks.find(t => t.id === log.taskId);
							if (task) {
								log.taskName = task.title;
							}
						}
					}
					
					return true;
				});
			},
			
			// Статистика
			getTaskStats: (taskId) => {
				const state = get();
				const taskLogs = state.timeLogs.filter((log) => log.taskId === taskId);
				
				return {
					totalTime: taskLogs.reduce((sum, log) => sum + log.timeSpent, 0),
					sessionCount: taskLogs.length,
					averageSessionTime:
						taskLogs.length > 0
							? taskLogs.reduce((sum, log) => sum + log.timeSpent, 0) /
							taskLogs.length
							: 0,
				};
			},
			
			getDailyStats: (date = new Date()) => {
				const state = get();
				const startOfDay = new Date(date);
				startOfDay.setHours(0, 0, 0, 0);
				const endOfDay = new Date(date);
				endOfDay.setHours(23, 59, 59, 999);
				
				const dailyLogs = state.timeLogs.filter(
					(log) =>
						new Date(log.startTime) >= startOfDay &&
						new Date(log.endTime) <= endOfDay
				);
				
				return {
					totalTime: dailyLogs.reduce((sum, log) => sum + log.timeSpent, 0),
					sessions: dailyLogs.length,
					pomodoroSessions: dailyLogs.filter((log) => log.mode === "pomodoro")
						.length,
					taskBreakdown: dailyLogs.reduce((acc, log) => {
						acc[log.taskId] = (acc[log.taskId] || 0) + log.timeSpent;
						return acc;
					}, {}),
				};
			},
		}),
		{
			name: "timer-storage",
			partialize: (state) => ({
				pomodoroSettings: state.pomodoroSettings,
				selectedTaskId: state.selectedTaskId,
				timeLogs: state.timeLogs,
			}),
		}
	)
);

/**
 * Хук для использования таймера с задачами
 */
export const useTimer = () => {
	const store = useTimerStore();
	const [time, setTime] = React.useState(0);
	
	// Получаем текущую продолжительность для режима pomodoro
	const getCurrentPomodoroTime = React.useCallback(() => {
		return store.getCurrentPomodoroTime();
	}, [store]);
	
	React.useEffect(() => {
		if (!store.isRunning) {
			if (store.mode === 'pomodoro') {
				setTime(getCurrentPomodoroTime());
			} else {
				setTime(0);
			}
		}
	}, [store.isRunning, store.mode, getCurrentPomodoroTime]);
	
	// Основной эффект таймера
	React.useEffect(() => {
		let interval = null;
		if (store.isRunning) {
			interval = setInterval(() => {
				setTime((prevTime) => {
					if (store.mode === 'pomodoro') {
						// Обратный отсчет для pomodoro
						if (prevTime <= 1) {
							store.stopTimer();
							store.handlePomodoroComplete();
							return getCurrentPomodoroTime();
						}
						return prevTime - 1;
					} else {
						// Прямой отсчет для обычного таймера
						return prevTime + 1;
					}
				});
			}, 1000);
		}
		
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [store.isRunning, store.mode, getCurrentPomodoroTime]);
	
	const handleStartTimer = (options) => {
		// При старте таймера ВСЕГДА устанавливаем полное время для помодоро
		if (store.mode === 'pomodoro') {
			setTime(getCurrentPomodoroTime());
		} else {
			setTime(0);
		}
		store.startTimer(options);
	};
	
	const handleStopTimer = () => {
		store.stopTimer();
		// При остановке возвращаем полное время
		if (store.mode === 'pomodoro') {
			setTime(getCurrentPomodoroTime());
		} else {
			setTime(0);
		}
	};
	
	const handleSetMode = (newMode) => {
		store.setMode(newMode);
		// При смене режима устанавливаем соответствующее время
		if (newMode === 'pomodoro') {
			setTime(store.pomodoroSettings.workTime * 60);
		} else {
			setTime(0);
		}
	};
	
	return {
		time,
		isRunning: store.isRunning,
		mode: store.mode,
		currentMode: store.currentMode,
		selectedTaskId: store.selectedTaskId,
		pomodoroSettings: store.pomodoroSettings,
		timeLogs: store.timeLogs,
		formattedTime: formatTime(time),
		
		startTimer: handleStartTimer,
		stopTimer: handleStopTimer,
		setMode: handleSetMode,
		resetTimer: store.resetTimer,
		setSelectedTask: store.setSelectedTask,
		updatePomodoroSettings: store.updatePomodoroSettings,
		getFilteredLogs: store.getFilteredLogs,
		updateTimeLog: store.updateTimeLog,
		deleteTimeLog: store.deleteTimeLog,
		getTaskStats: store.getTaskStats,
		getDailyStats: store.getDailyStats,
		showShortTimeAlert: store.showShortTimeAlert,
		setShowShortTimeAlert: store.setShowShortTimeAlert,
	};
};