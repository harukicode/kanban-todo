import { create } from "zustand";
import useColumnsStore from "./ColumnsStore";
import useSubtaskStore from "./SubtaskStore";

const API_URL = 'http://localhost:5000/api';

const useTaskStore = create(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,
      isTaskFindActive: false,
      timeLogs: [],
      isLoading: false,
      error: null,
      setTasks: (newTasks) => set({ tasks: newTasks }),
      
      fetchTasks: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/tasks`);
          if (!response.ok) throw new Error('Failed to fetch tasks');
          const tasks = await response.json();
          set({ tasks, isLoading: false });
          return tasks;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Функции для поиска и выбора задачи
      setSelectedTaskId: (taskId) =>
        set({ selectedTaskId: taskId, isTaskFindActive: false }),
      
      startFind: () => set({ isTaskFindActive: true }),
      
      // Управление задачами
      addTask: async (columnId, newTask) => {
        set({ isLoading: true });
        try {
          console.log('Adding task:', { columnId, newTask });
          
          // Преобразуем приоритет в нижний регистр
          const taskData = {
            ...newTask,
            columnId,
            priority: newTask.priority?.toLowerCase() || 'none',
            dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
            comments: newTask.comments || [],
            timeSpent: 0
          };
          
          const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            console.error('Server error:', data);
            throw new Error(data.message || 'Failed to add task');
          }
          
          console.log('Task added successfully:', data);
          
          const { columns, setColumns } = useColumnsStore.getState();
          const updatedColumns = columns.map(column =>
            column.id === columnId
              ? { ...column, tasks: [...column.tasks, data] }
              : column
          );
          setColumns(updatedColumns);
          
          set(state => ({
            tasks: [...state.tasks, data],
            isLoading: false
          }));
        } catch (error) {
          console.error('Error in addTask:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      deleteTask: async (columnId, taskId) => {
        set({ isLoading: true });
        try {
          console.log('Deleting task:', taskId, 'from column:', columnId);
          
          const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.message || 'Failed to delete task');
          }
          
          const { columns, setColumns } = useColumnsStore.getState();
          const updatedColumns = columns.map(column =>
            column.id === columnId
              ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
              : column
          );
          setColumns(updatedColumns);
          
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error in deleteTask:', error);
          set({ error: error.message, isLoading: false });
        }
      },
      
      updateTask: async (updatedTask, columnId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
          });
          
          if (!response.ok) throw new Error('Failed to update task');
          const task = await response.json();
          
          const { columns, setColumns } = useColumnsStore.getState();
          const updatedColumns = columns.map((column) =>
            column.id === columnId
              ? {
                ...column,
                tasks: column.tasks.map((t) => (t.id === task.id ? task : t)),
              }
              : column
          );
          setColumns(updatedColumns);
          
          set(state => ({
            tasks: state.tasks.map(t => t.id === task.id ? task : t),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // В объект состояния useTaskStore добавим:
      deleteComment: async (taskId, commentId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/tasks/${taskId}/comments/${commentId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete comment');
          const updatedTask = await response.json();
          
          const { columns, setColumns } = useColumnsStore.getState();
          const updatedColumns = columns.map(column => ({
            ...column,
            tasks: column.tasks.map(task =>
              task.id === taskId ? updatedTask : task
            )
          }));
          
          setColumns(updatedColumns);
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === taskId ? updatedTask : task
            ),
            isLoading: false
          }));
          
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      moveTask: async (
        timeSpent,
        description,
        comments,
        dueDate,
        taskId,
        fromColumnId,
        toColumnId,
        toProjectId,
      ) => {
        set({ isLoading: true });
        try {
          console.log('Moving task:', { taskId, fromColumnId, toColumnId }); // для отладки
          
          const taskToMove = get().tasks.find((task) => task.id === taskId);
          if (!taskToMove) throw new Error(`Task with id ${taskId} not found`);
          
          const updatedTask = {
            ...taskToMove,
            description,
            columnId: toColumnId,
            projectId: toProjectId,
            dueDate,
            comments,
            timeSpent,
          };
          
          const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
          });
          
          if (!response.ok) throw new Error('Failed to move task');
          const task = await response.json();
          
          const { columns, setColumns } = useColumnsStore.getState();
          const { getSubtasksForTask, updateSubtask } = useSubtaskStore.getState();
          
          // Обновляем состояние колонок, удаляя задачу из старой колонки и добавляя в новую
          const updatedColumns = columns.map((column) => {
            if (column.id === fromColumnId) {
              return {
                ...column,
                tasks: column.tasks.filter((t) => t.id !== taskId),
              };
            }
            if (column.id === toColumnId) {
              // Проверяем, нет ли уже такой задачи в колонке
              const taskExists = column.tasks.some((t) => t.id === taskId);
              if (!taskExists) {
                return {
                  ...column,
                  tasks: [...column.tasks, task],
                };
              }
            }
            return column;
          });
          
          setColumns(updatedColumns);
          
          // Обработка doneColumn
          const targetColumn = columns.find((column) => column.id === toColumnId);
          if (targetColumn?.doneColumn) {
            const subtasks = getSubtasksForTask(taskId);
            await Promise.all(subtasks.map(subtask =>
              updateSubtask(subtask.id, {
                completed: true,
                completedAt: new Date().toISOString(),
              })
            ));
            
            task.completed = true;
            task.completedAt = new Date().toISOString();
            await fetch(`${API_URL}/tasks/${taskId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(task)
            });
          }
          
          // Обновляем состояние задач
          set(state => ({
            tasks: state.tasks.map(t => t.id === taskId ? task : t),
            isLoading: false
          }));
          
          console.log('Task moved successfully:', task); // для отладки
        } catch (error) {
          console.error('Error moving task:', error);
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Работа с логами времени
      addTimeLog: async (logEntry) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/tasks/${logEntry.taskId}/timelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logEntry)
          });
          
          if (!response.ok) throw new Error('Failed to add time log');
          const updatedTask = await response.json();
          
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === logEntry.taskId ? updatedTask : task
            ),
            timeLogs: [...state.timeLogs, logEntry],
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      updateTimeLog: async (logId, updatedData) => {
        set({ isLoading: true });
        try {
          const oldLog = get().timeLogs.find(log => log.logId === logId);
          if (!oldLog) throw new Error('Time log not found');
          
          const response = await fetch(`${API_URL}/tasks/${oldLog.taskId}/timelog/${logId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
          
          if (!response.ok) throw new Error('Failed to update time log');
          const updatedTask = await response.json();
          
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === oldLog.taskId ? updatedTask : task
            ),
            timeLogs: state.timeLogs.map(log =>
              log.logId === logId ? { ...log, ...updatedData } : log
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      deleteTimeLog: async (logId) => {
        set({ isLoading: true });
        try {
          const logToDelete = get().timeLogs.find(log => log.logId === logId);
          if (!logToDelete) throw new Error('Time log not found');
          
          const response = await fetch(`${API_URL}/tasks/${logToDelete.taskId}/timelog/${logId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete time log');
          const updatedTask = await response.json();
          
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === logToDelete.taskId ? updatedTask : task
            ),
            timeLogs: state.timeLogs.filter(log => log.logId !== logId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      updateTimeSpent: async (taskId, timeSpent) => {
        set({ isLoading: true });
        try {
          const task = get().tasks.find((t) => t.id === taskId);
          if (!task) throw new Error('Task not found');
          
          const updatedTask = { ...task, timeSpent };
          
          const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
          });
          
          if (!response.ok) throw new Error('Failed to update time spent');
          const savedTask = await response.json();
          
          const { columns, setColumns } = useColumnsStore.getState();
          const updatedColumns = columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((t) => (t.id === taskId ? savedTask : t)),
          }));
          
          setColumns(updatedColumns);
          set(state => ({
            tasks: state.tasks.map(t => t.id === taskId ? savedTask : t),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
);

export default useTaskStore;