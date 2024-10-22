import { create } from "zustand";
import useColumnsStore from "./ColumnsStore";
import useProjectStore from "./ProjectsStore";

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
  moveTask: (taskId, fromColumnId, toColumnId, toProjectId) => {
    const { columns, setColumns } = useColumnsStore.getState();

    // Сначала ищем задачу в общем хранилище задач
    set((state) => {
      const taskToMove = state.tasks.find((task) => task.id === taskId);

      if (!taskToMove) {
        console.error(`Task with id ${taskId} not found in tasks store`);
        return state;
      }

      // Создаем обновленную задачу
      const updatedTask = {
        ...taskToMove,
        columnId: toColumnId,
        projectId: toProjectId,
      };

      // Обновляем колонки
      const updatedColumns = columns.map((column) => {
        if (column.id === fromColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }
        if (column.id === toColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, updatedTask],
          };
        }
        return column;
      });

      setColumns(updatedColumns);

      // Обновляем состояние tasks в TaskStore
      return {
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
      };
    });
  },

  // Вспомогательная функция для синхронизации задач
  syncTasksWithColumns: () => {
    const { columns, setColumns } = useColumnsStore.getState();

    set((state) => {
      // Создаем обновленные колонки с актуальными задачами
      const updatedColumns = columns.map((column) => ({
        ...column,
        tasks: state.tasks.filter((task) => task.columnId === column.id),
      }));

      setColumns(updatedColumns);
      return state;
    });
  },
}));

export default useTaskStore;
