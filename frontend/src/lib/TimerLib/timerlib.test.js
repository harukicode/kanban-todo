import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer, useTimerStore, formatTime } from '@/lib/TimerLib/timerLib.jsx';

describe('timerLib', () => {
	beforeEach(() => {
		useTimerStore.setState({
			isRunning: false,
			time: 0,
			mode: 'stopwatch',
			startTimestamp: null,
			currentLogId: null,
			selectedTaskId: null,
			currentSource: null,
			timeLogs: [],
		});
		
		vi.useFakeTimers(); // Enable fake timers
		vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0));
	});
	
	afterEach(() => {
		vi.useRealTimers(); // Restore real timers
	});
	
	describe('useTimer hook', () => {
		it('should start timer correctly', () => {
			const { result } = renderHook(() => useTimer());
			
			act(() => {
				result.current.setSelectedTask('task-1');
				result.current.startTimer({
					source: 'timer',
					taskId: 'task-1',
					taskName: 'Test Task'
				});
			});
			
			expect(result.current.isRunning).toBe(true);
			expect(result.current.selectedTaskId).toBe('task-1');
		});
		
		it('should stop timer and create log entry', async () => {
			// Мокаем Date.now() чтобы контролировать время
			const now = 1234567890000;
			vi.spyOn(Date, 'now').mockImplementation(() => now);
			
			const { result } = renderHook(() => useTimer());
			
			act(() => {
				result.current.setSelectedTask('task-1');
				result.current.startTimer({
					source: 'timer',
					taskId: 'task-1',
					taskName: 'Test Task'
				});
			});
			
			// Имитируем прохождение 10 секунд
			vi.spyOn(Date, 'now').mockImplementation(() => now + 10000);
			
			await act(async () => {
				result.current.stopTimer();
			});
			
			const logs = result.current.getFilteredLogs();
			expect(logs).toHaveLength(1);
			expect(logs[0].timeSpent).toBe(10);
		});
		
		it('should handle pomodoro mode correctly', () => {
			const { result } = renderHook(() => useTimer());
			
			act(() => {
				result.current.setMode('pomodoro');
			});
			
			expect(result.current.mode).toBe('pomodoro');
			expect(result.current.time).toBe(result.current.pomodoroSettings.workTime * 60);
		});
		
		it('should not create log for sessions shorter than 10 seconds in stopwatch mode', () => {
			const { result } = renderHook(() => useTimer());
			
			act(() => {
				result.current.setSelectedTask('task-1');
				result.current.startTimer({
					source: 'timer',
					taskId: 'task-1',
					taskName: 'Test Task'
				});
			});
			
			// Move time forward by 5 seconds
			vi.advanceTimersByTime(5000);
			
			act(() => {
				result.current.stopTimer();
			});
			
			const logs = result.current.getFilteredLogs();
			expect(logs).toHaveLength(0);
			expect(result.current.showShortTimeAlert).toBe(true);
		});
		
		it('should handle pomodoro settings updates', () => {
			const { result } = renderHook(() => useTimer());
			
			const newSettings = {
				workTime: 30,
				shortBreakTime: 7,
				longBreakTime: 20,
				longBreakInterval: 5
			};
			
			act(() => {
				result.current.updatePomodoroSettings(newSettings);
			});
			
			expect(result.current.pomodoroSettings).toEqual(newSettings);
		});
		
		it('should format time correctly', () => {
			const testCases = [
				{ input: 0, expected: '00:00:00' },
				{ input: 61, expected: '00:01:01' },
				{ input: 3661, expected: '01:01:01' }
			];
			
			testCases.forEach(({ input, expected }) => {
				expect(formatTime(input)).toBe(expected);
			});
		});
	});
});

it('should handle invalid task selection', () => {
	const { result } = renderHook(() => useTimer());
	
	act(() => {
		result.current.setSelectedTask('non-existent-task');
		result.current.startTimer();
	});
	
	const logs = result.current.getFilteredLogs();
	expect(logs[0]?.taskName).toBe('Unknown Task');
});


it('should filter logs correctly', () => {
	const { result } = renderHook(() => useTimer());
	const now = Date.now();
	
	// Добавляем тестовые логи
	act(() => {
		useTimerStore.setState({
			timeLogs: [
				{
					logId: '1',
					taskId: 'task-1',
					source: 'timer',
					startTime: new Date(now).toISOString(),
					endTime: new Date(now + 5000).toISOString(),
				},
				{
					logId: '2',
					taskId: 'task-2',
					source: 'focus',
					startTime: new Date(now).toISOString(),
					endTime: new Date(now + 5000).toISOString(),
				}
			]
		});
	});
	
	const timerLogs = result.current.getFilteredLogs({ source: 'timer' });
	expect(timerLogs).toHaveLength(1);
});


it('should update pomodoro settings', () => {
	const { result } = renderHook(() => useTimer());
	const newSettings = {
		workTime: 30,
		shortBreakTime: 7,
		longBreakTime: 20,
		longBreakInterval: 5
	};
	
	act(() => {
		result.current.updatePomodoroSettings(newSettings);
	});
	
	expect(result.current.pomodoroSettings).toEqual(newSettings);
});

it('should handle pomodoro work session correctly', async () => {
	const { result } = renderHook(() => useTimer());
	
	act(() => {
		useTimerStore.setState({
			mode: 'pomodoro',
			currentMode: 'work'
		});
	});
	
	act(() => {
		result.current.setSelectedTask('task-1');
		result.current.startTimer({
			source: 'timer',
			taskId: 'task-1',
			taskName: 'Test Task'
		});
	});
	
	const state = useTimerStore.getState();
	expect(state.mode).toBe('pomodoro');
	expect(state.currentMode).toBe('work');
});

it('should transition to break after work session', () => {
	const { result } = renderHook(() => useTimer());
	
	act(() => {
		useTimerStore.setState({
			mode: 'pomodoro',
			currentMode: 'work',
			isRunning: true
		});
		
		// Симулируем завершение рабочей сессии
		useTimerStore.getState().handlePomodoroComplete();
	});
	
	expect(useTimerStore.getState().currentMode).toBe('shortBreak');
});