import { create } from "zustand";
import useColumnsStore from "./ColumnsStore";

const useTaskStore = create((set) => ({
  tasks: [],

  // Добавление задачи
  addTask: (columnId, newTask) => {
    const { columns, setColumns } = useColumnsStore.getState();
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      columnId: columnId, // Добавляем привязку к колонке
    };

    // Обновляем состояние tasks в TaskStore
    set((state) => ({
      tasks: [...state.tasks, taskWithId],
    }));

    // Обновляем колонки
    const updatedColumns = columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            tasks: [...column.tasks, taskWithId],
          }
        : column
    );
    setColumns(updatedColumns);
  },

  // Удаление задачи
  deleteTask: (columnId, taskId) => {
    const { columns, setColumns } = useColumnsStore.getState();

    // Обновляем состояние tasks в TaskStore
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));

    // Обновляем колонки
    const updatedColumns = columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }
        : column
    );
    setColumns(updatedColumns);
  },

  // Обновление задачи
  updateTask: (updatedTask, columnId) => {
    const { columns, setColumns } = useColumnsStore.getState();
    const updatedColumns = columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          }
        : column
    );
    setColumns(updatedColumns);
  },

  // Перемещение задачи между колонками
  moveTask: (fromColumnId, toColumnId, taskId) => {
    const { columns, setColumns } = useColumnsStore.getState();
    const fromColumn = columns.find((col) => col.id === fromColumnId);
    const taskToMove = fromColumn.tasks.find((task) => task.id === taskId);

    const updatedColumns = columns.map((column) => {
      if (column.id === fromColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      }
      if (column.id === toColumnId) {
        return { ...column, tasks: [...column.tasks, taskToMove] };
      }
      return column;
    });

    setColumns(updatedColumns); // Обновляем колонки после перемещения задачи
  },
}));

export default useTaskStore;
