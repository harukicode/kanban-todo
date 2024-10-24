import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Subtask Store
 * Global state management for subtasks using Zustand
 * Includes persistence to localStorage
 */
const useSubtaskStore = create(
  persist(
    (set, get) => ({
      // State
      subtasks: [],
      
      // Actions
      /**
       * Add a new subtask
       * @param {string} taskId - ID of the parent task
       * @param {string} title - Title of the subtask
       */
      addSubtask: (taskId, title) =>
        set((state) => ({
          subtasks: [
            ...state.subtasks,
            {
              id: Date.now().toString(),
              taskId,
              title,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      
      /**
       * Toggle the completion status of a subtask
       * @param {string} subtaskId - ID of the subtask to toggle
       */
      toggleSubtask: (subtaskId) =>
        set((state) => ({
          subtasks: state.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? {
                ...subtask,
                completed: !subtask.completed,
                completedAt: !subtask.completed ? new Date().toISOString() : null
              }
              : subtask
          ),
        })),
      
      /**
       * Delete a subtask
       * @param {string} subtaskId - ID of the subtask to delete
       */
      deleteSubtask: (subtaskId) =>
        set((state) => ({
          subtasks: state.subtasks.filter((subtask) => subtask.id !== subtaskId),
        })),
      
      /**
       * Get all subtasks for a specific task
       * @param {string} taskId - ID of the task
       * @returns {Array} Array of subtasks for the specified task
       */
      getSubtasksForTask: (taskId) => {
        return get().subtasks.filter((subtask) => subtask.taskId === taskId);
      },
      
      /**
       * Delete all subtasks for a specific task
       * @param {string} taskId - ID of the task
       */
      deleteSubtasksForTask: (taskId) =>
        set((state) => ({
          subtasks: state.subtasks.filter((subtask) => subtask.taskId !== taskId),
        })),
      
      /**
       * Update a subtask
       * @param {string} subtaskId - ID of the subtask
       * @param {Object} updates - Object containing the updates
       */
      updateSubtask: (subtaskId, updates) =>
        set((state) => ({
          subtasks: state.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, ...updates, updatedAt: new Date().toISOString() }
              : subtask
          ),
        })),
      
      /**
       * Get completion statistics for a task's subtasks
       * @param {string} taskId - ID of the task
       * @returns {Object} Object containing completion statistics
       */
      getSubtaskStats: (taskId) => {
        const taskSubtasks = get().getSubtasksForTask(taskId);
        const total = taskSubtasks.length;
        const completed = taskSubtasks.filter(st => st.completed).length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        
        return {
          total,
          completed,
          progress,
          remaining: total - completed
        };
      }
    }),
    {
      name: 'subtask-storage',
      version: 1,
    }
  )
);

export default useSubtaskStore;