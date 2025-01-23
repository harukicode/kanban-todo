import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import FocusPage from '../FocusPage';

vi.mock('react-router-dom', () => ({
	useNavigate: vi.fn()
}));

vi.mock('@/lib/TimerLib/timerLib', () => ({
	useTimer: () => ({
		time: 0,
		isRunning: false,
		mode: 'stopwatch',
		setMode: vi.fn(),
		startTimer: vi.fn(),
		stopTimer: vi.fn(),
		getFilteredLogs: () => [],
		pomodoroSettings: { workTime: 25 }
	}),
	useTimerStore: () => ({
		showShortTimeAlert: false,
		setShowShortTimeAlert: vi.fn()
	})
}));

vi.mock('@/Stores/FocusTaskStore', () => ({
	default: () => ({
		focusTasks: [],
		addFocusTask: vi.fn(),
		deleteFocusTask: vi.fn(),
		updateFocusTask: vi.fn()
	})
}));

describe('FocusPage', () => {
	it('renders correctly', () => {
		render(<FocusPage />);
		expect(screen.getByText('Focus Mode')).toBeInTheDocument();
	});
	
	it('navigates back to kanban', () => {
		const navigate = vi.fn();
		useNavigate.mockReturnValue(navigate);
		
		render(<FocusPage />);
		fireEvent.click(screen.getByText('Back to Kanban'));
		expect(navigate).toHaveBeenCalledWith('/kanban');
	});
});