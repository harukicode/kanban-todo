import { create } from 'zustand';

const useProjectStore = create((set) => ({
	projects: [
		{ id: "new_project", name: "New Project", color: "#6b7280" }
	],
	activeProjectId: "all",
	
	addProject: (newProject) => set((state) => ({
		projects: [...state.projects, { ...newProject, id: Date.now().toString() }]
	})),
	
	setActiveProjectId: (id) => set({ activeProjectId: id }),
	
	deleteProject: (id) => set((state) => ({
		projects: state.projects.filter(project => project.id !== id),
		activeProjectId: state.activeProjectId === id ? "all" : state.activeProjectId
	})),
	
	filterByProject: (tasks, activeProjectId) => {
		if (activeProjectId === 'all') {
			return tasks; // Возвращаем все задачи, если выбран проект "all"
		}
		return tasks.filter(task => task.projectId === activeProjectId);
	},
	
	editProject: (id, updatedProject) => set((state) => ({
		projects: state.projects.map(project =>
			project.id === id ? { ...project, ...updatedProject } : project
		)
	}))
}));

export default useProjectStore;