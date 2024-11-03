import { useState, useCallback } from "react";
import { PointerSensor, useSensors, useSensor } from "@dnd-kit/core";

export const useKanbanDnD = ({ columns, moveTask, reorderTasks }) => {
  const [activeTask, setActiveTask] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  // Вспомогательная функция для поиска колонки по ID задачи
  const findColumnByTaskId = useCallback(
    (taskId) => columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    ),
    [columns]
  );
  
  // Функция для начала перетаскивания
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const activeColumn = findColumnByTaskId(active.id);
    if (activeColumn) {
      const activeTask = activeColumn.tasks.find(
        (task) => task.id === active.id
      );
      setActiveTask(activeTask);
    }
  }, [findColumnByTaskId]);
  
  // Функция для перемещения задачи
  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!active || !over) return;
    
    const activeColumn = findColumnByTaskId(active.id);
    const overColumn = findColumnByTaskId(over.id) || columns.find((col) => col.id === over.id);
    
    if (activeColumn && overColumn && (activeColumn !== overColumn || activeColumn.projectId !== overColumn.projectId)) {
      moveTask(active.data.current.timeSpent, active.data.current.description, active.data.current.comments, active.data.current.dueDate,active.id, activeColumn.id, overColumn.id, overColumn.projectId);
    }
  }, [findColumnByTaskId, columns, moveTask]);
  
  // Функция для завершения перетаскивания
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!active || !over) return;
    
    const activeColumn = findColumnByTaskId(active.id);
    const overColumn = findColumnByTaskId(over.id) || columns.find((col) => col.id === over.id);
    
    if (!activeColumn || !overColumn) return;
    
    if (activeColumn !== overColumn || activeColumn.projectId !== overColumn.projectId) {
      moveTask( active.data.current.timeSpent, active.data.current.description, active.data.current.comments,  active.data.current.dueDate, active.id, activeColumn.id, overColumn.id, overColumn.projectId);
    } else {
      const oldIndex = activeColumn.tasks.findIndex((task) => task.id === active.id);
      const newIndex = activeColumn.tasks.findIndex((task) => task.id === over.id);
      reorderTasks(activeColumn.id, oldIndex, newIndex);
    }
  }, [findColumnByTaskId, columns, moveTask, reorderTasks]);
  
  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
