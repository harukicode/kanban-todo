import useColumnsStore from '@/Stores/ColumnsStore.jsx'
import useTaskStore from '@/Stores/TaskStore.jsx'
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
            id: Date.now().toString()
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
      deleteProject: async (id) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
          });
          
          const data = await response.json();
          
          if (!response.ok) throw new Error('Failed to delete project');
          
          const columnsStore = useColumnsStore.getState();
          const taskStore = useTaskStore.getState();
          
          const updatedColumns = columnsStore.columns.filter(column => column.projectId !== id);
          columnsStore.setColumns(updatedColumns);
          
          const updatedTasks = taskStore.tasks.filter(task => {
            const column = columnsStore.columns.find(col => col.id === task.columnId);
            return column && column.projectId !== id;
          });
          taskStore.setTasks(updatedTasks);
          
          set(state => ({
            projects: state.projects.filter(p => p.id !== id),
            activeProjectId: state.activeProjectId === id ?
              (state.projects[0]?.id || null) : state.activeProjectId,
            isLoading: false,
            error: null
          }));
          
          console.log('Project deletion completed successfully');
          
        } catch (error) {
          console.error('Error during project deletion:', error);
          set({
            error: error.message,
            isLoading: false
          });
        }
      },
      setActiveProjectId: (id) => set({ activeProjectId: id }),
    }),
);

export default useProjectStore;