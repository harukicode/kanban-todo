import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx'
import useTaskStore from '@/Stores/TaskStore.jsx'
import React from 'react'
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_ENDPOINTS, apiRequest } from '@/config/api';

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
			startTimestamp: null, // Timestamp начала отсчета
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
			
			
			resetPomodoro: () => {
				set({
					currentMode: "work",
					currentInterval: 1,
					isRunning: false,
					startTimestamp: null
				});
			},
			
			calculateElapsedTime: () => {
				const state = get();
				if (!state.startTimestamp) return 0;
				
				const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000);
				
				if (state.mode === 'pomodoro') {
					const pomodoroTime = state.getCurrentPomodoroTime();
					return Math.max(0, pomodoroTime - elapsed);
				}
				return elapsed;
			},
			
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
			
			
			getLastSessionTime: () => {
				const state = get();
				if (state.mode !== 'pomodoro') return state.time;
				
				// Получаем время последней сессии на основе текущего режима
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
// timerLib.jsx
			startTimer: async (options = { source: 'timer' }) => {
				const state = get();
				const now = Date.now();
				const selectedTaskId = options.taskId || state.selectedTaskId;
				
				const isBreak = state.mode === 'pomodoro' &&
					(state.currentMode === 'shortBreak' || state.currentMode === 'longBreak');
				
				if (selectedTaskId && !isBreak) {
					try {
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
						
						// Нормализуем режим таймера
						const normalizedMode = state.mode === 'normal' ? 'stopwatch' : state.mode;
						
						const logEntry = {
							logId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
							taskId: selectedTaskId,
							taskName,
							startTime: new Date(now).toISOString(),
							endTime: new Date(now).toISOString(),
							timeSpent: 0,
							mode: normalizedMode,
							currentMode: state.currentMode,
							source: options.source
						};
						
						console.log('Creating time log with data:', logEntry);
						
						const newLog = await apiRequest(API_ENDPOINTS.timelogs, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(logEntry)
						});
						
						set((state) => ({
							isRunning: true,
							startTimestamp: now,
							currentLogId: logEntry.logId,
							timeLogs: [...state.timeLogs, newLog],
							selectedTaskId: selectedTaskId,
							currentSource: options.source
						}));
						
						return newLog;
					} catch (error) {
						console.error('Error creating time log:', error);
						throw error;
					}
				} else {
					set({
						isRunning: true,
						startTimestamp: now,
						selectedTaskId: selectedTaskId,
						currentSource: options.source
					});
				}
			},

// В функции stopTimer добавляем проверку режима
			stopTimer: async () => {
				const state = get();
				const now = Date.now();
				if (!state.startTimestamp) return;
				
				const isBreak = state.mode === 'pomodoro' &&
					(state.currentMode === 'shortBreak' || state.currentMode === 'longBreak');
				
				if (state.startTimestamp && state.selectedTaskId && !isBreak) {
					const elapsedSeconds = Math.floor((now - state.startTimestamp) / 1000);
					
					// Получаем время помодоро сессии, если мы в этом режиме
					const pomodoroTime = state.mode === 'pomodoro' ? state.getCurrentPomodoroTime() : 0;
					const remainingTime = state.mode === 'pomodoro' ? state.calculateElapsedTime() : 0;
					const actualTimeSpent = state.mode === 'pomodoro' ? pomodoroTime - remainingTime : elapsedSeconds;
					
					// Проверяем минимальное время для обоих режимов
					if (actualTimeSpent < 10) {
						set({
							showShortTimeAlert: true,
							isRunning: false,
							startTimestamp: null,
							currentLogId: null,
							currentSource: null
						});
						
						// Удаляем лог только если он существует
						if (state.currentLogId) {
							try {
								await apiRequest(`${API_ENDPOINTS.timelogs}/${state.currentLogId}`, {
									method: 'DELETE'
								});
								
								set(state => ({
									timeLogs: state.timeLogs.filter(log => log.logId !== state.currentLogId)
								}));
							} catch (error) {
								console.error('Error deleting short time log:', error);
							}
						}
						return;
					}
					
					// Обновляем лог только если он существует
					if (state.currentLogId) {
						try {
							const updatedLog = await apiRequest(`${API_ENDPOINTS.timelogs}/${state.currentLogId}`, {
								method: 'PUT',
								body: JSON.stringify({
									endTime: new Date(now).toISOString(),
									timeSpent: actualTimeSpent
								})
							});
							
							set(state => ({
								isRunning: false,
								startTimestamp: null,
								timeLogs: state.timeLogs.map((log) =>
									log.logId === state.currentLogId ? updatedLog : log
								),
								currentLogId: null,
								currentSource: null
							}));
						} catch (error) {
							console.error('Error updating time log:', error);
							set({
								isRunning: false,
								startTimestamp: null,
								currentLogId: null,
								currentSource: null
							});
						}
					} else {
						set({
							isRunning: false,
							startTimestamp: null,
							currentLogId: null,
							currentSource: null
						});
					}
				} else {
					set({
						isRunning: false,
						startTimestamp: null,
						currentLogId: null,
						currentSource: null
					});
				}
			},
			
			initializeTimer: async () => {
				try {
					await get().fetchLogs();
					await get().fetchPomodoroSettings();
				} catch (error) {
					console.error('Error initializing timer:', error);
				}
			},
			
			
			// Управление режимами
			setMode: (mode) => {
				set({
					mode,
					startTimestamp: null,
					currentMode: "work",
					currentInterval: 1,
					isRunning: false,
				});
			},
			
			// Получение логов при инициализации
			fetchLogs: async () => {
				try {
					const logs = await apiRequest(API_ENDPOINTS.timelogs);
					set({ timeLogs: logs });
				} catch (error) {
					console.error('Error fetching logs:', error);
				}
			},
			
			// Загрузка настроек Pomodoro
			fetchPomodoroSettings: async () => {
				try {
					const response = await fetch('/api/settings/pomodoro');
					const settings = await response.json();
					set({ pomodoroSettings: settings });
				} catch (error) {
					console.error('Error fetching pomodoro settings:', error);
				}
			},
			
			
			// Обновление настроек Pomodoro
			updatePomodoroSettings: async (newSettings) => {
				try {
					const response = await fetch('/api/settings/pomodoro', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(newSettings)
					});
					const settings = await response.json();
					set({ pomodoroSettings: settings });
				} catch (error) {
					console.error('Error updating pomodoro settings:', error);
				}
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
			
			// Добавление лога времени
			addTimeLog: async (log) => {
				try {
					const response = await fetch('/api/timelogs', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(log)
					});
					const newLog = await response.json();
					set(state => ({
						timeLogs: [...state.timeLogs, newLog]
					}));
				} catch (error) {
					console.error('Error adding time log:', error);
				}
			},
			
			// Обновление лога времени
			updateTimeLog: async (logId, updatedData) => {
				try {
					const updatedLog = await apiRequest(`${API_ENDPOINTS.timelogs}/${logId}`, {
						method: 'PUT',
						body: JSON.stringify(updatedData)
					});
					
					// Немедленно обновляем состояние с обновленным логом
					set((state) => ({
						timeLogs: state.timeLogs.map(log =>
							log.logId === logId ? updatedLog : log
						)
					}));
					
					return updatedLog;
				} catch (error) {
					console.error('Error updating time log:', error);
					throw error;
				}
			},
			
			// Удаление лога времени
			deleteTimeLog: async (logId) => {
				try {
					await apiRequest(`${API_ENDPOINTS.timelogs}/${logId}`, {
						method: 'DELETE'
					});
					
					// Немедленно обновляем состояние, удаляя лог
					set((state) => ({
						timeLogs: state.timeLogs.filter(log => log.logId !== logId)
					}));
				} catch (error) {
					console.error('Error deleting time log:', error);
					throw error;
				}
			},
			
			// Получение отфильтрованных логов
			getFilteredLogs: async (filters = {}) => {
				try {
					const queryParams = new URLSearchParams();
					if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
					if (filters.endDate) queryParams.append('endDate', filters.endDate.toISOString());
					if (filters.source) queryParams.append('source', filters.source);
					if (filters.mode) queryParams.append('mode', filters.mode);
					
					const logs = await apiRequest(`${API_ENDPOINTS.timelogs}?${queryParams}`);
					
					// Обновляем состояние при получении логов
					set({ timeLogs: logs });
					
					return logs;
				} catch (error) {
					console.error('Error fetching filtered logs:', error);
					return [];
				}
			},
			
			// Статистика
			getTaskStats: async (taskId) => {
				try {
					const logs = await get().getFilteredLogs({ taskId });
					
					return {
						totalTime: logs.reduce((sum, log) => sum + log.timeSpent, 0),
						sessionCount: logs.length,
						averageSessionTime: logs.length > 0
							? logs.reduce((sum, log) => sum + log.timeSpent, 0) / logs.length
							: 0
					};
				} catch (error) {
					console.error('Error getting task stats:', error);
					return {
						totalTime: 0,
						sessionCount: 0,
						averageSessionTime: 0
					};
				}
			},
			
			getDailyStats: async (date = new Date()) => {
				try {
					const startOfDay = new Date(date);
					startOfDay.setHours(0, 0, 0, 0);
					const endOfDay = new Date(date);
					endOfDay.setHours(23, 59, 59, 999);
					
					const logs = await get().getFilteredLogs({
						startDate: startOfDay,
						endDate: endOfDay
					});
					
					return {
						totalTime: logs.reduce((sum, log) => sum + log.timeSpent, 0),
						sessions: logs.length,
						pomodoroSessions: logs.filter((log) => log.mode === "pomodoro").length,
						taskBreakdown: logs.reduce((acc, log) => {
							acc[log.taskId] = (acc[log.taskId] || 0) + log.timeSpent;
							return acc;
						}, {})
					};
				} catch (error) {
					console.error('Error getting daily stats:', error);
					return {
						totalTime: 0,
						sessions: 0,
						pomodoroSessions: 0,
						taskBreakdown: {}
					};
				}
			},
		}),
		{
			name: "timer-storage",
			partialize: (state) => ({
				pomodoroSettings: state.pomodoroSettings,
				selectedTaskId: state.selectedTaskId,
				timeLogs: state.timeLogs,
				startTimestamp: state.startTimestamp,
				isRunning: state.isRunning,
				mode: state.mode,
				currentMode: state.currentMode,
				currentInterval: state.currentInterval,
			}),
		}
	)
);

/**
 * Хук для использования таймера с задачами
 */
export const useTimer = () => {
	const store = useTimerStore();
	const [displayTime, setDisplayTime] = React.useState(0);
	const [pendingMode, setPendingMode] = React.useState(null);
	const [showModeChangeAlert, setShowModeChangeAlert] = React.useState(false);
	
	const getCurrentPomodoroTime = React.useCallback(() => {
		return store.getCurrentPomodoroTime();
	}, [store]);
	
	const handleTimeUpdate = (newTime) => {
		setDisplayTime(newTime);
		// Обновляем store только при изменении времени таймера
		if (store.isRunning) {
			store.updateTime(newTime);
		}
	};
	
	React.useEffect(() => {
		// Загружаем логи при монтировании
		store.fetchLogs();
		
		// Создаем интервал для регулярного обновления
		const intervalId = setInterval(() => {
			store.fetchLogs();
		}, 5000); // Обновляем каждые 5 секунд
		
		return () => {
			clearInterval(intervalId);
		};
	}, []);
	
	React.useEffect(() => {
		if (!store.isRunning) {
			if (store.mode === 'pomodoro') {
				setDisplayTime(getCurrentPomodoroTime());
			} else {
				setDisplayTime(0);
			}
		}
	}, [store.isRunning, store.mode, getCurrentPomodoroTime]);
	
	React.useEffect(() => {
		let intervalId;
		
		if (store.isRunning) {
			const updateDisplay = () => {
				const elapsed = store.calculateElapsedTime();
				setDisplayTime(elapsed);
				
				// Проверяем завершение помодоро
				if (store.mode === 'pomodoro' && elapsed <= 0) {
					store.stopTimer();
					store.handlePomodoroComplete();
				}
			};
			
			// Обновляем время каждую секунду
			intervalId = setInterval(updateDisplay, 1000);
			// Начальное обновление
			updateDisplay();
		} else {
			// Сбрасываем время при остановке
			if (store.mode === 'pomodoro') {
				setDisplayTime(store.getCurrentPomodoroTime());
			} else {
				setDisplayTime(0);
			}
		}
		
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [store.isRunning, store.mode, store.startTimestamp]);
	
	const handleStartTimer = async (options) => {
		if (store.mode === 'pomodoro') {
			const initialTime = getCurrentPomodoroTime();
			handleTimeUpdate(initialTime);
		} else {
			handleTimeUpdate(0);
		}
		
		try {
			await store.startTimer(options);
			await store.fetchLogs(); // Просто обновляем логи через существующий метод
		} catch (error) {
			console.error('Error starting timer:', error);
		}
	};
	
	const handleDeleteTimeLog = async (logId) => {
		try {
			await store.deleteTimeLog(logId);
			await store.fetchLogs(); // Обновляем логи после удаления
		} catch (error) {
			console.error('Error deleting time log:', error);
		}
	};
	
	const handleUpdateTimeLog = async (logId, updates) => {
		try {
			await store.updateTimeLog(logId, updates);
			await store.fetchLogs(); // Обновляем логи после обновления
		} catch (error) {
			console.error('Error updating time log:', error);
		}
	};
	
	const handleStopTimer = async () => {
		try {
			store.updateTime(displayTime);
			await store.stopTimer();
			await store.fetchLogs(); // Обновляем логи после остановки
			
			if (store.mode === 'pomodoro') {
				handleTimeUpdate(getCurrentPomodoroTime());
			} else {
				handleTimeUpdate(0);
			}
		} catch (error) {
			console.error('Error stopping timer:', error);
		}
	};
	
	const handleSetMode = (newMode) => {
		// Если таймер не запущен, меняем режим сразу
		if (!store.isRunning) {
			store.setMode(newMode);
			if (newMode === 'pomodoro') {
				setDisplayTime(store.pomodoroSettings.workTime * 60);
			} else {
				setDisplayTime(0);
			}
			return;
		}
		
		// Если таймер запущен, показываем предупреждение
		setPendingMode(newMode);
		setShowModeChangeAlert(true);
	};
	
	const handleConfirmModeChange = () => {
		if (pendingMode) {
			// Сначала останавливаем текущий таймер
			store.stopTimer();
			// Затем меняем режим
			store.setMode(pendingMode);
			if (pendingMode === 'pomodoro') {
				setDisplayTime(store.pomodoroSettings.workTime * 60);
			} else {
				setDisplayTime(0);
			}
			setPendingMode(null);
			setShowModeChangeAlert(false);
		}
	};
	
	const handleResetPomodoro = () => {
		store.resetPomodoro();
		if (store.mode === 'pomodoro') {
			handleTimeUpdate(store.pomodoroSettings.workTime * 60);
		}
	};
	
	return {
		time: displayTime,
		isRunning: store.isRunning,
		mode: store.mode,
		currentMode: store.currentMode,
		showModeChangeAlert,
		setShowModeChangeAlert,
		handleConfirmModeChange,
		setMode: handleSetMode,
		pendingMode,
		selectedTaskId: store.selectedTaskId,
		pomodoroSettings: store.pomodoroSettings,
		timeLogs: store.timeLogs,
		formattedTime: formatTime(displayTime),
		
		startTimer: handleStartTimer,
		stopTimer: handleStopTimer,
		resetTimer: store.resetTimer,
		resetPomodoro: handleResetPomodoro,
		setSelectedTask: store.setSelectedTask,
		updatePomodoroSettings: store.updatePomodoroSettings,
		getFilteredLogs: store.getFilteredLogs,
		deleteTimeLog: handleDeleteTimeLog,
		updateTimeLog: handleUpdateTimeLog,
		getTaskStats: store.getTaskStats,
		getDailyStats: store.getDailyStats,
		showShortTimeAlert: store.showShortTimeAlert,
		setShowShortTimeAlert: store.setShowShortTimeAlert,
		
	};
};