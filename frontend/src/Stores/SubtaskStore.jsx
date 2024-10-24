import { create } from "zustand";


const useSubtaskStore = create((set, get) => ({
  subtasks: [],
  
  addSubtask: (taskId, title) =>
    set((state) => ({
      subtasks: [
        ...state.subtasks,
        {
          id: crypto.randomUUID(),
          taskId,
          title,
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          updatedAt: null,
        },
      ],
    })),
  
  toggleSubtask: (subtaskId) =>
    set((state) => ({
      subtasks: state.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? {
            ...subtask,
            completed: !subtask.completed,
            completedAt: !subtask.completed ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
          }
          : subtask
      ),
    })),
  
  deleteSubtask: (subtaskId) =>
    set((state) => ({
      subtasks: state.subtasks.filter((subtask) => subtask.id !== subtaskId),
    })),
  
  getSubtasksForTask: (taskId) => {
    return get().subtasks.filter((subtask) => subtask.taskId === taskId);
  },
  
  deleteSubtasksForTask: (taskId) =>
    set((state) => ({
      subtasks: state.subtasks.filter((subtask) => subtask.taskId !== taskId),
    })),
  
  updateSubtask: (subtaskId, updates) =>
    set((state) => ({
      subtasks: state.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? {
            ...subtask,
            ...updates,
            updatedAt: new Date().toISOString()
          }
          : subtask
      ),
    })),
  
  getSubtaskStats: (taskId) => {
    const taskSubtasks = get().getSubtasksForTask(taskId);
    const total = taskSubtasks.length;
    const completed = taskSubtasks.filter((st) => st.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      total,
      completed,
      progress: Math.round(progress * 10) / 10, // Round to 1 decimal place
      remaining: total - completed,
      hasSubtasks: total > 0,
    };
  },
  
  addMultipleSubtasks: (taskId, titles) =>
    set((state) => ({
      subtasks: [
        ...state.subtasks,
        ...titles.map((title) => ({
          id: crypto.randomUUID(),
          taskId,
          title,
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          updatedAt: null,
        })),
      ],
    })),
  
  reorderSubtasks: (taskId, sourceIndex, destinationIndex) =>
    set((state) => {
      const taskSubtasks = [...get().getSubtasksForTask(taskId)];
      const otherSubtasks = state.subtasks.filter((st) => st.taskId !== taskId);
      
      const [removed] = taskSubtasks.splice(sourceIndex, 1);
      taskSubtasks.splice(destinationIndex, 0, removed);
      
      return {
        subtasks: [...otherSubtasks, ...taskSubtasks],
      };
    }),
}));

export default useSubtaskStore;