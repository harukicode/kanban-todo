export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
	timelogs: `${API_BASE_URL}/api/timelogs`,
	settings: {
		pomodoro: `${API_BASE_URL}/api/settings/pomodoro`
	}
};

export async function apiRequest(endpoint, options = {}) {
	try {
		const response = await fetch(endpoint, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('API request failed:', error);
		throw error;
	}
}