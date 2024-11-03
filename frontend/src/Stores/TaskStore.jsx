import { create } from "zustand";
import useColumnsStore from "./ColumnsStore";
import useSubtaskStore from "./SubtaskStore";

const useTaskStore = create((set) => {
  return ({
    tasks: [],
    
    // Добавление задачи
    addTask: (columnId, newTask) => {
      const { columns, setColumns } = useColumnsStore.getState()
      const taskWithId = {
        ...newTask,
        id: Date.now().toString(),
        columnId: columnId, // Добавляем привязку к колонке
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
        comments: newTask.comments || [],
      }
      
      // Обновляем состояние tasks в TaskStore
      set((state) => ({
        tasks: [...state.tasks, taskWithId]
      }))
      
      // Обновляем колонки
      const updatedColumns = columns.map((column) =>
        column.id === columnId
          ? {
            ...column,
            tasks: [...column.tasks, taskWithId]
          }
          : column
      )
      setColumns(updatedColumns)
    },
    
    // Удаление задачи
    deleteTask: (columnId, taskId) => {
      const { columns, setColumns } = useColumnsStore.getState()
      
      // Обновляем состояние tasks в TaskStore
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId)
      }))
      
      // Обновляем колонки
      const updatedColumns = columns.map((column) =>
        column.id === columnId
          ? {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId)
          }
          : column
      )
      setColumns(updatedColumns)
    },
    
    // Обновление задачи
    updateTask: (updatedTask, columnId) => {
      const { columns, setColumns } = useColumnsStore.getState()
      const updatedColumns = columns.map((column) =>
        column.id === columnId
          ? {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          }
          : column
      )
      setColumns(updatedColumns)
    },
    
    // Перемещение задачи между колонками
    moveTask: (comments, dueDate, taskId, fromColumnId, toColumnId, toProjectId) => {
      const { columns, setColumns } = useColumnsStore.getState()
      const { getSubtasksForTask, updateSubtask } = useSubtaskStore.getState() // Получаем методы для работы с подзадачами
      
      set((state) => {
        const taskToMove = state.tasks.find((task) => task.id === taskId)
        
        if (!taskToMove) {
          console.error(`Task with id ${taskId} not found in tasks store`)
          return state
        }
        
        // Создаем обновленную задачу
        const updatedTask = {
          ...taskToMove,
          columnId: toColumnId,
          projectId: toProjectId,
          dueDate: dueDate,
          comments: comments,
        }
        
        // Обновляем колонки
        const updatedColumns = columns.map((column) => {
          if (column.id === fromColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId)
            }
          }
          if (column.id === toColumnId) {
            return {
              ...column,
              tasks: [...column.tasks, updatedTask]
            }
          }
          return column
        })
        
        setColumns(updatedColumns)
        
        // Проверяем, является ли новая колонка выполненной
        const targetColumn = columns.find((column) => column.id === toColumnId)
        if (targetColumn && targetColumn.doneColumn) {
          // Если колонка помечена как doneColumn, обновляем задачу и её подзадачи
          const subtasks = getSubtasksForTask(taskId)
          subtasks.forEach((subtask) => {
            updateSubtask(subtask.id, {
              completed: true,
              completedAt: new Date().toISOString(),
              
            })
          })
          
          // Обновляем задачу как выполненную
          updatedTask.completed = true
          updatedTask.completedAt = new Date().toISOString()
        }
        
        // Обновляем состояние tasks в TaskStore
        return {
          tasks: state.tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          )
        }
      })
    }
  })
});

export default useTaskStore;
