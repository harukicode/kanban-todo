import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
global.localStorage = localStorageMock;


// Mock Date
global.Date.now = vi.fn(() => 1234567890);

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

