import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = 'http://localhost:5000/api/focustasks';

const useFocusTaskStore = create(
	persist(
		(set, get) => ({
			focusTasks: [],
			isLoading: false,
			error: null,
			
			// Загрузка задач с сервера
			fetchFocusTasks: async () => {
				set({ isLoading: true, error: null });
				try {
					const response = await fetch(API_URL);
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Failed to fetch tasks');
					}
					const tasks = await response.json();
					set({ focusTasks: tasks, isLoading: false });
				} catch (error) {
					console.error('Fetch tasks error:', error);
					set({ error: error.message, isLoading: false });
				}
			},
			
			// Добавление новой задачи
			addFocusTask: async (newTask) => {
				set({ isLoading: true, error: null });
				try {
					const response = await fetch(API_URL, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							text: newTask.text,
						})
					});
					
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Failed to add task');
					}
					
					const taskData = await response.json();
					
					set(state => ({
						focusTasks: [...state.focusTasks, taskData],
						isLoading: false
					}));
					
					return taskData;
				} catch (error) {
					console.error('Add task error:', error);
					set({ error: error.message, isLoading: false });
					return null;
				}
			},
			
			// Удаление задачи
			deleteFocusTask: async (taskId) => {
				set({ isLoading: true, error: null });
				try {
					const response = await fetch(`${API_URL}/${taskId}`, {
						method: 'DELETE'
					});
					
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Failed to delete task');
					}
					
					set(state => ({
						focusTasks: state.focusTasks.filter((task) => task.id !== taskId),
						isLoading: false
					}));
				} catch (error) {
					console.error('Delete task error:', error);
					set({ error: error.message, isLoading: false });
				}
			},
			
			// Обновление задачи
			updateFocusTask: async (taskId, updates) => {
				set({ isLoading: true, error: null });
				try {
					const response = await fetch(`${API_URL}/${taskId}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(updates)
					});
					
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Failed to update task');
					}
					
					const updatedTask = await response.json();
					
					set(state => ({
						focusTasks: state.focusTasks.map((task) =>
							task.id === taskId ? updatedTask : task
						),
						isLoading: false
					}));
				} catch (error) {
					console.error('Update task error:', error);
					set({ error: error.message, isLoading: false });
				}
			},
			
			// Получение задачи по ID
			getFocusTaskById: (taskId) => {
				return get().focusTasks.find((task) => task.id === taskId);
			},
			
			// Сброс ошибки
			clearError: () => set({ error: null })
		}),
		{
			name: "focus-tasks-storage",
			getStorage: () => localStorage,
			partialize: (state) => ({
				focusTasks: state.focusTasks
			})
		}
	)
);

export default useFocusTaskStore;