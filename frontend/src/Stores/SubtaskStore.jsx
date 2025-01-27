import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_URL = 'http://localhost:5000/api';

const useSubtaskStore = create(
  persist(
    (set, get) => ({
      subtasks: [],
      isLoading: false,
      error: null,
      
      // Fetch subtasks
      fetchSubtasks: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/subtasks`);
          if (!response.ok) throw new Error('Failed to fetch subtasks');
          const subtasks = await response.json();
          set({ subtasks, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Add subtask
      addSubtask: async (taskId, title) => {
        set({ isLoading: true, error: null });
        try {
          const subtaskData = {
            taskId,
            title,
            completed: false
          };
          
          console.log('Sending subtask data:', subtaskData);
          
          const response = await fetch(`${API_URL}/subtasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subtaskData)
          });
          
          const data = await response.json();
          if (!response.ok) {
            console.error('Server response:', data);
            throw new Error(data.message || 'Failed to create subtask');
          }
          
          set(state => ({
            subtasks: [...state.subtasks, data],
            isLoading: false
          }));
          return data;
        } catch (error) {
          console.error('Error in addSubtask:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Toggle subtask completion
      toggleSubtask: async (subtaskId) => {
        set({ isLoading: true });
        try {
          const subtask = get().subtasks.find(st => st.id === subtaskId);
          if (!subtask) throw new Error('Subtask not found');
          
          const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              completed: !subtask.completed
            })
          });
          
          if (!response.ok) throw new Error('Failed to update subtask');
          const updatedSubtask = await response.json();
          
          set(state => ({
            subtasks: state.subtasks.map(st =>
              st.id === subtaskId ? updatedSubtask : st
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Delete subtask
      deleteSubtask: async (subtaskId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete subtask');
          
          set(state => ({
            subtasks: state.subtasks.filter(st => st.id !== subtaskId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Delete all subtasks for a task
      deleteSubtasksForTask: async (taskId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/subtasks/task/${taskId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete subtasks');
          
          set(state => ({
            subtasks: state.subtasks.filter(st => st.taskId !== taskId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Update subtask
      updateSubtask: async (subtaskId, updates) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
          
          if (!response.ok) throw new Error('Failed to update subtask');
          const updatedSubtask = await response.json();
          
          set(state => ({
            subtasks: state.subtasks.map(st =>
              st.id === subtaskId ? updatedSubtask : st
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Helper functions
      getSubtasksForTask: (taskId) => {
        return get().subtasks.filter(st => st.taskId === taskId);
      },
      
      getSubtaskStats: (taskId) => {
        const taskSubtasks = get().getSubtasksForTask(taskId);
        const total = taskSubtasks.length;
        const completed = taskSubtasks.filter(st => st.completed).length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        
        return {
          total,
          completed,
          progress: Math.round(progress * 10) / 10,
          remaining: total - completed,
          hasSubtasks: total > 0,
        };
      },
      
      // Bulk operations
      addMultipleSubtasks: async (taskId, titles) => {
        set({ isLoading: true });
        try {
          const promises = titles.map(title =>
            fetch(`${API_URL}/subtasks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                taskId,
                title,
                completed: false
              })
            }).then(res => res.json())
          );
          
          const newSubtasks = await Promise.all(promises);
          
          set(state => ({
            subtasks: [...state.subtasks, ...newSubtasks],
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Reorder subtasks (optional, implement if needed)
      reorderSubtasks: (taskId, sourceIndex, destinationIndex) => {
        set(state => {
          const taskSubtasks = [...get().getSubtasksForTask(taskId)];
          const otherSubtasks = state.subtasks.filter(st => st.taskId !== taskId);
          
          const [removed] = taskSubtasks.splice(sourceIndex, 1);
          taskSubtasks.splice(destinationIndex, 0, removed);
          
          return {
            subtasks: [...otherSubtasks, ...taskSubtasks],
          };
        });
      },
    }),
    {
      name: "subtask-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        subtasks: state.subtasks,
      }),
    }
  )
);

export default useSubtaskStore;