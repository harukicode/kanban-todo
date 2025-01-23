// TimeCard.test.jsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent  from '@testing-library/user-event';
import TimerCard from '../TimerCard';

describe('TimerCard', () => {
	const defaultProps = {
		timerMode: 'normal',
		switchTimerMode: vi.fn(),
		time: 1500,
		isRunning: false,
		toggleTimer: vi.fn(),
		resetPomodoro: vi.fn(),
		activeTask: { id: '1', text: 'Test Task' },
		formatTime: (time) => {
			const hours = Math.floor(time / 3600);
			const minutes = Math.floor((time % 3600) / 60);
			const seconds = time % 60;
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		},
		logs: [],
		focusTasks: [],
		pomodoroSettings: {
			workTime: 25,
			shortBreakTime: 5,
			longBreakTime: 15,
			longBreakInterval: 4
		},
		updatePomodoroSettings: vi.fn(),
		showModeChangeAlert: false,
		setShowModeChangeAlert: vi.fn(),
		handleConfirmModeChange: vi.fn(),
		pendingMode: null
	};
	
	// Время ожидания для асинхронных операций
	const TIMEOUT = 5000;

// Общая функция для переключения вкладок
	const switchTab = async (name) => {
		const tab = screen.getByRole('tab', { name });
		await userEvent.click(tab);
		await waitFor(() =>
				expect(tab).toHaveAttribute('data-state', 'active'),
			{ timeout: TIMEOUT }
		);
	};
	
	// Базовый тест рендеринга
	it('renders basic elements correctly', async () => {
		render(<TimerCard {...defaultProps} />);
		
		expect(await screen.findByText(/Timer \(Normal\)/i)).toBeInTheDocument();
		expect(await screen.findByRole('button', { name: /Switch Mode/i })).toBeInTheDocument();
		expect(await screen.findByText('00:25:00')).toBeInTheDocument();
	});
	
	// Тест переключения вкладок
	it('switches between tabs', async () => {
		render(<TimerCard {...defaultProps} />);
		
		await switchTab(/logs/i);
		expect(screen.getByTestId('no-logs')).toBeInTheDocument();
		
		await switchTab(/settings/i);
		expect(screen.getByLabelText(/work duration/i)).toBeInTheDocument();
	});
	
	// Тест отображения активной задачи
	it('displays active task', async () => {
		render(<TimerCard {...defaultProps} />);
		
		expect(await screen.findByText(/Active Task/i)).toBeInTheDocument();
		expect(await screen.findByText(/Test Task/i)).toBeInTheDocument();
	});
	
	// Тест управления таймером
	it('handles timer controls', async () => {
		const toggleMock = vi.fn();
		render(<TimerCard {...defaultProps} toggleTimer={toggleMock} />);
		
		const startButton = await screen.findByRole('button', { name: /Start/i });
		fireEvent.click(startButton);
		expect(toggleMock).toHaveBeenCalled();
	});
	
	// Тест отображения логов
	it('displays logs correctly', async () => {
		const testLogs = [{
			logId: '1',
			taskName: 'Test Task',
			startTime: new Date().toISOString(),
			endTime: new Date().toISOString(),
			timeSpent: 1500,
			mode: 'pomodoro',
			currentMode: 'work'
		}];
		
		render(<TimerCard {...defaultProps} logs={testLogs} />);
		
		await switchTab(/logs/i);
		
		await waitFor(() => {
			expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
			expect(screen.getByTestId('log-mode')).toHaveTextContent('Pomodoro - work');
		}, { timeout: TIMEOUT });
	});
	
	// Тест сброса таймера в режиме Pomodoro
	it('handles pomodoro reset', async () => {
		const resetMock = vi.fn();
		render(<TimerCard {...defaultProps} timerMode="pomodoro" resetPomodoro={resetMock} />);
		
		const resetButton = await screen.findByRole('button', { name: /Reset/i });
		fireEvent.click(resetButton);
		expect(resetMock).toHaveBeenCalled();
	});
	
	
});