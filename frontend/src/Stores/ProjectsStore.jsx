import { create } from 'zustand';

const useProjectStore = create((set) => ({
	projects: [
		{ id: "all", name: "All Projects", color: "#6b7280" }
	],
	activeProjectId: "all",
	
	addProject: (newProject) => set((state) => ({
		projects: [...state.projects, { ...newProject, id: Date.now().toString() }]
	})),
	
	setActiveProjectId: (id) => set({ activeProjectId: id }),
}));

export default useProjectStore;
