import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useProjectStore = create(
  persist(
    (set) => ({
      projects: [
        { id: "default_project", name: "Default Project", color: "#6b7280" },
      ],
      activeProjectId: "default_project",
      
      addProject: (newProject) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { ...newProject, id: Date.now().toString() },
          ],
        })),
      
      setActiveProjectId: (id) => set({ activeProjectId: id }),
      
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          activeProjectId:
            state.activeProjectId === id
              ? "default_project"
              : state.activeProjectId,
        })),
      
      editProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        })),
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
      }),
    }
  )
);

export default useProjectStore;