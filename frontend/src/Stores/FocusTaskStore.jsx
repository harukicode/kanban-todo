// FocusTaskStore.jsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useFocusTaskStore = create(
	persist(
		(set, get) => ({
			focusTasks: [],
			
			addFocusTask: (newTask) => {
				const taskWithId = {
					...newTask,
					id: Date.now().toString(),
					timeSpent: 0,
					sessions: []
				};
				
				set((state) => ({
					focusTasks: [...state.focusTasks, taskWithId],
				}));
				
				return taskWithId;
			},
			
			deleteFocusTask: (taskId) => {
				set((state) => ({
					focusTasks: state.focusTasks.filter((task) => task.id !== taskId),
				}));
			},
			
			updateFocusTask: (taskId, updates) => {
				set((state) => ({
					focusTasks: state.focusTasks.map((task) =>
						task.id === taskId ? { ...task, ...updates } : task
					),
				}));
			},
			
			getFocusTaskById: (taskId) => {
				return get().focusTasks.find((task) => task.id === taskId);
			},
		}),
		{
			name: "focus-tasks-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useFocusTaskStore;