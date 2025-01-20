import { create } from "zustand"
import { persist } from "zustand/middleware"

const COLORS = [
	{ name: "Sky Blue", value: "#87CEEB", hover: "#7AB8D3" },
	{ name: "Mint Green", value: "#98FF98", hover: "#89E589" },
	{ name: "Peach", value: "#FFDAB9", hover: "#E5C4A7" },
	{ name: "Lavender", value: "#E6E6FA", hover: "#CFCFE1" },
	{ name: "Light Yellow", value: "#FFFACD", hover: "#E5E1B9" },
	{ name: "Light Pink", value: "#FFB6C1", hover: "#E5A3AD" },
]

const MAX_TASKS = 44
const MAX_TASK_LENGTH = 20

export const useMindMapStore = create(
	persist(
		(set) => ({
			tasks: [],
			newTask: "",
			selectedColor: COLORS[0],
			colors: COLORS,
			
			setNewTask: (text) => set({ newTask: text }),
			
			addTask: () =>
				set((state) => {
					if (!state.newTask.trim() || state.tasks.length >= MAX_TASKS) return state
					
					const newTask = {
						id: Date.now().toString(),
						text: state.newTask.trim().slice(0, MAX_TASK_LENGTH),
						color: state.selectedColor.value,
						hoverColor: state.selectedColor.hover,
					}
					
					return {
						tasks: [...state.tasks, newTask],
						newTask: "",
					}
				}),
			
			removeTask: (taskId) =>
				set((state) => ({
					tasks: state.tasks.filter((task) => task.id !== taskId),
				})),
			
			setSelectedColor: (color) => set({ selectedColor: color }),
		}),
		{
			name: "mind-map-storage",
			getStorage: () => localStorage,
		},
	),
)

export const MAX_TASKS_LIMIT = MAX_TASKS
export const MAX_TASK_LENGTH_LIMIT = MAX_TASK_LENGTH

