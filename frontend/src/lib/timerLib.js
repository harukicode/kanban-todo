// timerLib.js
import useTaskStore from '@/Stores/TaskStore.jsx'
import React from 'react'
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

/**
 * Форматирование времени в формат HH:MM:SS
 */
export const formatTime = (timeInSeconds) => {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = timeInSeconds % 60;
	return `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Основное хранилище таймера
 */
export const useTimerStore = create(
	persist(
		(set, get) => ({
			// Состояние таймера
			isRunning: false,
			time: 0,
			mode: "stopwatch", // 'stopwatch' | 'pomodoro'
			startTime: null,
			currentLogId: null,
			selectedTaskId: null,
			
			// Настройки Pomodoro
			pomodoroSettings: {
				workTime: 25,
				shortBreakTime: 5,
				longBreakTime: 15,
				longBreakInterval: 4,
			},
			currentMode: "work", // 'work' | 'shortBreak' | 'longBreak'
			currentInterval: 1,
			
			// Логи времени
			timeLogs: [],
			
			// Действия с таймером
			// В useTimerStore
			startTimer: () => {
				const now = new Date();
				const state = get();
				const selectedTaskId = state.selectedTaskId;
				
				if (selectedTaskId) {
					const task = useTaskStore.getState().tasks.find(t => t.id === selectedTaskId);
					
					const logEntry = {
						logId: Date.now().toString(),
						taskId: selectedTaskId,
						taskName: task?.title || "Unknown Task", // Добавляем название задачи
						startTime: now.toISOString(),
						endTime: now.toISOString(),
						timeSpent: 0,
						mode: state.mode,
						currentMode: state.currentMode
					};
					
					set((state) => ({
						isRunning: true,
						startTime: now.toISOString(),
						currentLogId: logEntry.logId,
						timeLogs: [...state.timeLogs, logEntry],
					}));
				}
			},
			
			stopTimer: () => {
				const state = get();
				if (state.startTime && state.selectedTaskId) {
					const endTime = new Date();
					const startTime = new Date(state.startTime);
					const timeSpent = Math.floor(
						(endTime.getTime() - startTime.getTime()) / 1000
					);
					
					set((state) => ({
						isRunning: false,
						startTime: null,
						time: timeSpent,
						timeLogs: state.timeLogs.map((log) =>
							log.logId === state.currentLogId
								? {
									...log,
									endTime: endTime.toISOString(),
									timeSpent: timeSpent,
								}
								: log
						),
						currentLogId: null,
					}));
				}
			},
			
			resetTimer: () => {
				const state = get();
				set((state) => ({
					time: 0,
					isRunning: false,
					startTime: null,
					currentLogId: null,
					timeLogs: state.timeLogs.filter(
						(log) => log.logId !== state.currentLogId
					),
				}));
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
				const taskStore = useTaskStore.getState();
				set((state) => ({
					timeLogs: state.timeLogs.map((log) =>
						log.logId === logId ? { ...log, ...updatedData } : log
					),
				}));
				taskStore.updateTimeLog(logId, updatedData);
			},
			
			deleteTimeLog: (logId) => {
				const taskStore = useTaskStore.getState();
				set((state) => ({
					timeLogs: state.timeLogs.filter((log) => log.logId !== logId),
				}));
				taskStore.deleteTimeLog(logId);
			},
			
			getFilteredLogs: (filters = {}) => {
				const state = get();
				return state.timeLogs.filter((log) => {
					if (filters.taskId && log.taskId !== filters.taskId) return false;
					if (
						filters.startDate &&
						new Date(log.startTime) < new Date(filters.startDate)
					)
						return false;
					if (
						filters.endDate &&
						new Date(log.endTime) > new Date(filters.endDate)
					)
						return false;
					if (filters.mode && log.mode !== filters.mode) return false;
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
		if (store.mode !== 'pomodoro') return 0;
		
		switch (store.currentMode) {
			case 'work':
				return store.pomodoroSettings.workTime * 60;
			case 'shortBreak':
				return store.pomodoroSettings.shortBreakTime * 60;
			case 'longBreak':
				return store.pomodoroSettings.longBreakTime * 60;
			default:
				return store.pomodoroSettings.workTime * 60;
		}
	}, [store.mode, store.currentMode, store.pomodoroSettings]);
	
	// Эффект для инициализации времени при смене режима
	React.useEffect(() => {
		if (store.mode === 'pomodoro') {
			setTime(getCurrentPomodoroTime());
		} else {
			setTime(0);
		}
	}, [store.mode, store.currentMode, getCurrentPomodoroTime]);
	
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
							store.handlePomodoroComplete(); // Переключаем на следующий режим
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
	
	const handleStartTimer = () => {
		// Устанавливаем начальное время для pomodoro при старте
		if (store.mode === 'pomodoro' && !store.isRunning) {
			setTime(getCurrentPomodoroTime());
		}
		store.startTimer();
	};
	
	const handleStopTimer = () => {
		store.stopTimer();
		// При остановке сбрасываем время в зависимости от режима
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
		resetTimer: () => {
			store.resetTimer();
			if (store.mode === 'pomodoro') {
				setTime(getCurrentPomodoroTime());
			} else {
				setTime(0);
			}
		},
		setSelectedTask: store.setSelectedTask,
		updatePomodoroSettings: store.updatePomodoroSettings,
		getFilteredLogs: store.getFilteredLogs,
		getTaskStats: store.getTaskStats,
		getDailyStats: store.getDailyStats,
	};
};