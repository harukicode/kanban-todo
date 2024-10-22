import { create } from "zustand";

const useSubtaskStore = create((set, get) => ({
  subtasks: [],

  addSubtask: (taskId, title) =>
    set((state) => ({
      subtasks: [
        ...state.subtasks,
        { id: Date.now().toString(), taskId, title, completed: false },
      ],
    })),

  toggleSubtask: (subtaskId) =>
    set((state) => ({
      subtasks: state.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
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
}));

export default useSubtaskStore;
