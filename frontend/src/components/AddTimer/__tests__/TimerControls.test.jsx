import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimerControls from '@/components/AddTimer/TimerControls';

describe('TimerControls', () => {
	const mockStartStop = vi.fn();
	const mockReset = vi.fn();
	
	beforeEach(() => {
		mockStartStop.mockClear();
		mockReset.mockClear();
	});
	
	it('should show Start button when not running', () => {
		render(
			<TimerControls
				isRunning={false}
				onStartStop={mockStartStop}
				onReset={mockReset}
				disabled={false}
				showReset={true}
				isPomodoroMode={true}
			/>
		);
		
		expect(screen.getByText('Start')).toBeInTheDocument();
	});
	
	it('should show Stop button when running', () => {
		render(
			<TimerControls
				isRunning={true}
				onStartStop={mockStartStop}
				onReset={mockReset}
				disabled={false}
				showReset={true}
				isPomodoroMode={true}
			/>
		);
		
		expect(screen.getByText('Stop')).toBeInTheDocument();
	});
	
	it('should call onStartStop when Start/Stop button is clicked', () => {
		render(
			<TimerControls
				isRunning={false}
				onStartStop={mockStartStop}
				onReset={mockReset}
				disabled={false}
				showReset={true}
				isPomodoroMode={true}
			/>
		);
		
		fireEvent.click(screen.getByText('Start'));
		expect(mockStartStop).toHaveBeenCalledTimes(1);
	});
	
	it('should show Reset button only in Pomodoro mode with showReset=true', () => {
		const { rerender } = render(
			<TimerControls
				isRunning={false}
				onStartStop={mockStartStop}
				onReset={mockReset}
				disabled={false}
				showReset={true}
				isPomodoroMode={true}
			/>
		);
		
		expect(screen.getByText('Reset')).toBeInTheDocument();
		
		// Re-render with isPomodoroMode=false
		rerender(
			<TimerControls
				isRunning={false}
				onStartStop={mockStartStop}
				onReset={mockReset}
				disabled={false}
				showReset={true}
				isPomodoroMode={false}
			/>
		);
		
		expect(screen.queryByText('Reset')).not.toBeInTheDocument();
	});
	
	it('should disable buttons when disabled prop is true', () => {
		render(
			<TimerControls
				isRunning={false}
				onStartStop={mockStartStop}
				onReset={mockReset}
				disabled={true}
				showReset={true}
				isPomodoroMode={true}
			/>
		);
		
		expect(screen.getByText('Start')).toBeDisabled();
	});
});