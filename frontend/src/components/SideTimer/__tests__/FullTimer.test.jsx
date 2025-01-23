import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import FullTimer from '../FullTimer';
import { useTimer, useTimerStore } from '@/lib/TimerLib/timerLib';

vi.mock('@/lib/TimerLib/timerLib', () => ({
	useTimer: vi.fn(),
	useTimerStore: vi.fn()
}));

vi.mock('@/stores/TaskStore', () => ({
	__esModule: true,
	default: vi.fn((selector) =>
		selector({
			tasks: [{ id: '1', title: 'Test Task' }],
			// Add other state properties if necessary
		})
	),
}));

describe('FullTimer', () => {
	beforeEach(() => {
		useTimer.mockReturnValue({
			time: 0,
			isRunning: false,
			mode: 'stopwatch',
			setMode: vi.fn(),
			startTimer: vi.fn(),
			stopTimer: vi.fn(),
			selectedTaskId: null,
			setSelectedTask: vi.fn(),
			pomodoroSettings: { workTime: 25 },
			formattedTime: '00:00:00',
			updatePomodoroSettings: vi.fn(),
			showModeChangeAlert: false,
			setShowModeChangeAlert: vi.fn(),
		});
		
		useTimerStore.mockReturnValue({
			showShortTimeAlert: false,
			setShowShortTimeAlert: vi.fn(),
			// Прямое возвращение состояния без вложенного state
			tasks: [{id: '1', title: 'Test Task'}]
		});
	});
	
	it('renders correctly', async () => {
		const { findByText } = render(<FullTimer onClose={vi.fn()} />);
		expect(await findByText('Timer')).toBeTruthy();
	});
	
	it('handles mode switch correctly', async () => {
		const setMode = vi.fn();
		useTimer.mockReturnValue({
			...useTimer(),
			setMode,
		});
		
		const { findByRole } = render(<FullTimer onClose={vi.fn()} />);
		const switchButton = await findByRole('switch');
		fireEvent.click(switchButton);
		expect(setMode).toHaveBeenCalledWith('pomodoro');
	});
	
	it('handles timer actions correctly', async () => {
		const startTimer = vi.fn();
		// Set up mock BEFORE rendering
		useTimer.mockReturnValue({
			...useTimer(), // Retain other default mock values
			selectedTaskId: '1',
			startTimer,
		});
		
		const { findByText } = render(<FullTimer onClose={vi.fn()} />);
		const button = await findByText('Start');
		fireEvent.click(button);
		expect(startTimer).toHaveBeenCalled();
	});
});