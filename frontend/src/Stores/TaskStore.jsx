import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import useColumnsStore from "./ColumnsStore";
import useSubtaskStore from "./SubtaskStore";

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,
      isTaskFindActive: false,
      timeLogs: [], // Добавляем хранение логов в TaskStore
      
      // Функции для поиска и выбора задачи
      setSelectedTaskId: (taskId) =>
        set((state) => ({
          selectedTaskId: taskId,
          isTaskFindActive: false,
        })),
      
      startFind: () =>
        set({
          isTaskFindActive: true,
        }),
      
      // Управление задачами
      addTask: (columnId, newTask) => {
        const { columns, setColumns } = useColumnsStore.getState();
        const taskWithId = {
          ...newTask,
          id: Date.now().toString(),
          columnId: columnId,
          dueDate: newTask.dueDate
            ? new Date(newTask.dueDate).toISOString()
            : null,
          comments: newTask.comments || [],
          timeSpent: 0,
        };
        
        set((state) => ({
          tasks: [...state.tasks, taskWithId],
        }));
        
        const updatedColumns = columns.map((column) =>
          column.id === columnId
            ? {
              ...column,
              tasks: [...column.tasks, taskWithId],
            }
            : column,
        );
        setColumns(updatedColumns);
      },
      
      deleteTask: (columnId, taskId) => {
        const { columns, setColumns } = useColumnsStore.getState();
        
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
        
        const updatedColumns = columns.map((column) =>
          column.id === columnId
            ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
            : column,
        );
        setColumns(updatedColumns);
      },
      
      updateTask: (updatedTask, columnId) => {
        const { columns, setColumns } = useColumnsStore.getState();
        const updatedColumns = columns.map((column) =>
          column.id === columnId
            ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task,
              ),
            }
            : column,
        );
        setColumns(updatedColumns);
      },
      
      moveTask: (
        timeSpent,
        description,
        comments,
        dueDate,
        taskId,
        fromColumnId,
        toColumnId,
        toProjectId,
      ) => {
        const { columns, setColumns } = useColumnsStore.getState();
        const { getSubtasksForTask, updateSubtask } =
          useSubtaskStore.getState();
        
        set((state) => {
          const taskToMove = state.tasks.find((task) => task.id === taskId);
          
          if (!taskToMove) {
            console.error(`Task with id ${taskId} not found in tasks store`);
            return state;
          }
          
          const updatedTask = {
            ...taskToMove,
            description: description,
            columnId: toColumnId,
            projectId: toProjectId,
            dueDate: dueDate,
            comments: comments,
            timeSpent: timeSpent,
          };
          
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
          
          const targetColumn = columns.find(
            (column) => column.id === toColumnId,
          );
          if (targetColumn && targetColumn.doneColumn) {
            const subtasks = getSubtasksForTask(taskId);
            subtasks.forEach((subtask) => {
              updateSubtask(subtask.id, {
                completed: true,
                completedAt: new Date().toISOString(),
              });
            });
            
            updatedTask.completed = true;
            updatedTask.completedAt = new Date().toISOString();
          }
          
          return {
            tasks: state.tasks.map((task) =>
              task.id === taskId ? updatedTask : task,
            ),
          };
        });
      },
      
      // Работа с логами времени
      addTimeLog: (logEntry) => {
        set(state => {
          const updatedTasks = state.tasks.map(task => {
            if (task.id === logEntry.taskId) {
              return {
                ...task,
                timeSpent: (task.timeSpent || 0) + (logEntry.timeSpent || 0),
                timeLogs: [...(task.timeLogs || []), logEntry]
              };
            }
            return task;
          });
          
          return {
            ...state,
            tasks: updatedTasks,
            timeLogs: [...state.timeLogs, logEntry]
          };
        });
      },
      
      updateTimeLog: (logId, updatedData) => {
        set(state => {
          const oldLog = state.timeLogs.find(log => log.logId === logId);
          const timeDiff = updatedData.timeSpent - (oldLog?.timeSpent || 0);
          
          const updatedTasks = state.tasks.map(task => {
            if (oldLog && task.id === oldLog.taskId) {
              return {
                ...task,
                timeSpent: Math.max(0, (task.timeSpent || 0) + timeDiff),
                timeLogs: (task.timeLogs || []).map(log =>
                  log.logId === logId ? { ...log, ...updatedData } : log
                )
              };
            }
            return task;
          });
          
          return {
            ...state,
            tasks: updatedTasks,
            timeLogs: state.timeLogs.map(log =>
              log.logId === logId ? { ...log, ...updatedData } : log
            )
          };
        });
      },
      
      deleteTimeLog: (logId) => {
        set(state => {
          const logToDelete = state.timeLogs.find(log => log.logId === logId);
          
          const updatedTasks = state.tasks.map(task => {
            if (logToDelete && task.id === logToDelete.taskId) {
              return {
                ...task,
                timeSpent: Math.max(0, (task.timeSpent || 0) - (logToDelete.timeSpent || 0)),
                timeLogs: (task.timeLogs || []).filter(log => log.logId !== logId)
              };
            }
            return task;
          });
          
          return {
            ...state,
            tasks: updatedTasks,
            timeLogs: state.timeLogs.filter(log => log.logId !== logId)
          };
        });
      },
      
      // Обновление времени задачи
      updateTimeSpent: (taskId, timeSpent) => {
        const { columns, setColumns } = useColumnsStore.getState();
        const task = get().tasks.find((t) => t.id === taskId);
        
        if (!task) return;
        
        const updatedTask = {
          ...task,
          timeSpent: timeSpent,
        };
        
        const updatedColumns = columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        }));
        
        setColumns(updatedColumns);
        
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        }));
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        timeLogs: state.timeLogs,
      }),
    }
  )
);

export default useTaskStore;