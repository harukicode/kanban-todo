import { create } from "zustand";

const API_URL = 'http://localhost:5000/api';

const useProjectStore = create(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      isLoading: false,
      error: null,
      
      // Загрузка проектов
      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/projects`);
          if (!response.ok) throw new Error('Failed to fetch projects');
          const projects = await response.json();
          
          set({
            projects,
            // Если есть проекты, устанавливаем первый как активный
            activeProjectId: projects.length > 0 ? projects[0].id : null,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          });
        }
      },
      
      // Добавление проекта
      addProject: async (newProject) => {
        set({ isLoading: true });
        try {
          console.log('Making request to add project:', newProject);
          const projectWithId = {
            ...newProject,
            id: Date.now().toString() // Добавляем id здесь
          };
          
          const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectWithId),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.message || 'Failed to add project');
          }
          
          const project = await response.json();
          console.log('Received response:', project);
          
          set(state => ({
            projects: [...state.projects, project],
            activeProjectId: state.projects.length === 0 ? project.id : state.activeProjectId,
            isLoading: false,
            error: null
          }));
          
          return project;
        } catch (error) {
          console.error('Error in addProject:', error);
          set({
            error: error.message,
            isLoading: false
          });
          throw error;
        }
      },
      
      // Обновление проекта
      editProject: async (id, updatedProject) => {
        set({ isLoading: true });
        try {
          if (!id || !updatedProject) {
            throw new Error('Invalid project data');
          }
          
          const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProject),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update project');
          }
          
          const project = await response.json();
          
          set(state => {
            // Проверяем, существует ли проект перед обновлением
            const projectExists = state.projects.some(p => p.id === id);
            if (!projectExists) {
              return state;
            }
            
            return {
              ...state,
              projects: state.projects.map(p =>
                p.id === id ? { ...p, ...project } : p
              ),
              isLoading: false,
              error: null
            };
          });
          
          return project;
        } catch (error) {
          console.error('Error in editProject:', error);
          set(state => ({
            ...state,
            isLoading: false,
            error: error.message
          }));
          throw error;
        }
      },
      // Удаление проекта
      deleteProject: async (id) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) throw new Error('Failed to delete project');
          
          set(state => ({
            projects: state.projects.filter(p => p.id !== id),
            activeProjectId: state.activeProjectId === id ?
              'default_project' : state.activeProjectId,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          });
        }
      },
      
      // Установка активного проекта
      setActiveProjectId: (id) => set({ activeProjectId: id }),
    }),
    {
      name: "project-storage",
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
      }),
    }
);

export default useProjectStore;