import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimerDisplay from '@/components/AddTimer/TimerDisplay';

describe('TimerDisplay', () => {
	it('should format and display time correctly', () => {
		render(<TimerDisplay time={3665} />); // 1 hour, 1 minute, 5 seconds
		expect(screen.getByText('01:01:05')).toBeInTheDocument();
	});
	
	it('should display zeros when time is 0', () => {
		render(<TimerDisplay time={0} />);
		expect(screen.getByText('00:00:00')).toBeInTheDocument();
	});
	
	it('should handle large numbers', () => {
		render(<TimerDisplay time={36000} />); // 10 hours
		expect(screen.getByText('10:00:00')).toBeInTheDocument();
	});
});