import { create } from "zustand"

const COLORS = [
	{ name: "Sky Blue", value: "#87CEEB", hover: "#7AB8D3" },
	{ name: "Mint Green", value: "#98FF98", hover: "#89E589" },
	{ name: "Peach", value: "#FFDAB9", hover: "#E5C4A7" },
	{ name: "Lavender", value: "#E6E6FA", hover: "#CFCFE1" },
	{ name: "Light Yellow", value: "#FFFACD", hover: "#E5E1B9" },
	{ name: "Light Pink", value: "#FFB6C1", hover: "#E5A3AD" },
]

const MAX_TASKS = 45
const MAX_TASK_LENGTH = 20
const API_URL = 'http://localhost:5000/api/mindmap';

export const useMindMapStore = create(
		(set, get) => ({
			tasks: [],
			newTask: "",
			selectedColor: COLORS[0],
			colors: COLORS,
			isLoading: false,
			error: null,
			
			fetchTasks: async () => {
				set({ isLoading: true, error: null });
				try {
					const response = await fetch(API_URL);
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Failed to fetch tasks');
					}
					const tasks = await response.json();
					
					// Преобразуем данные из БД в формат фронтенда
					const formattedTasks = tasks.map(task => ({
						...task,
						color: {
							value: task.color,
							hover: task.hoverColor
						}
					}));
					
					set({ tasks: formattedTasks, isLoading: false });
				} catch (error) {
					console.error('Fetch tasks error:', error);
					set({ error: error.message, isLoading: false });
				}
			},
			
			setNewTask: (text) => set({ newTask: text }),
			
			addTask: async () => {
				const { newTask, selectedColor, tasks } = get();
				
				if (!newTask.trim() || tasks.length >= MAX_TASKS) return;
				
				set({ isLoading: true, error: null });
				try {
					const taskId = Date.now().toString();
					
					// Создаем данные в формате, ожидаемом сервером
					const taskData = {
						id: taskId,
						text: newTask.trim().slice(0, MAX_TASK_LENGTH),
						color: selectedColor.value,
						hoverColor: selectedColor.hover
					};
					
					console.log('Sending task data:', taskData);
					
					const response = await fetch(API_URL, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(taskData)
					});
					
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Failed to add task');
					}
					
					const newTaskData = await response.json();
					
					// Преобразуем полученные данные в формат фронтенда
					const formattedTask = {
						...newTaskData,
						color: {
							value: newTaskData.color,
							hover: newTaskData.hoverColor
						}
					};
					
					set(state => ({
						tasks: [...state.tasks, formattedTask],
						newTask: "",
						isLoading: false
					}));
				} catch (error) {
					console.error('Add task error:', error);
					set({ error: error.message, isLoading: false });
				}
			},
			
			removeTask: async (taskId) => {
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
						tasks: state.tasks.filter((task) => task.id !== taskId),
						isLoading: false
					}));
				} catch (error) {
					console.error('Remove task error:', error);
					set({ error: error.message, isLoading: false });
				}
			},
			
			setSelectedColor: (color) => set({ selectedColor: color }),
			clearError: () => set({ error: null })
		}),
);

export const MAX_TASKS_LIMIT = MAX_TASKS
export const MAX_TASK_LENGTH_LIMIT = MAX_TASK_LENGTH