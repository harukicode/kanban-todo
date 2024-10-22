import { useState } from "react";
import { PointerSensor, useSensors, useSensor } from "@dnd-kit/core";

// Создаем хук для работы с DnD
export const useKanbanDnD = ({ columns, moveTask, reorderTasks }) => {
  const [activeTask, setActiveTask] = useState(null); // Храним активную задачу
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Настройка активации сенсора
      },
    })
  );

  // Функция для начала перетаскивания
  const handleDragStart = (event) => {
    const { active } = event;
    const activeColumn = findColumnByTaskId(active.id);
    if (activeColumn) {
      const activeTask = activeColumn.tasks.find(
        (task) => task.id === active.id
      );
      setActiveTask(activeTask); // Сохраняем активную задачу
    }
  };

  // Функция для перемещения задачи
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (active && over) {
      const activeColumn = findColumnByTaskId(active.id);
      const overColumn =
        findColumnByTaskId(over.id) ||
        columns.find((col) => col.id === over.id);

      if (
        activeColumn &&
        overColumn &&
        (activeColumn !== overColumn ||
          activeColumn.projectId !== overColumn.projectId)
      ) {
        // Здесь мы проверяем, изменился ли проект
        moveTask(
          active.id,
          activeColumn.id,
          overColumn.id,
          overColumn.projectId
        );
      }
    }
  };

  // Функция для завершения перетаскивания
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnByTaskId(activeId);
    const overColumn =
      findColumnByTaskId(overId) || columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn) return;

    if (
      activeColumn !== overColumn ||
      activeColumn.projectId !== overColumn.projectId
    ) {
      moveTask(activeId, activeColumn.id, overColumn.id, overColumn.projectId);
    } else {
      const oldIndex = activeColumn.tasks.findIndex(
        (task) => task.id === activeId
      );
      const newIndex = activeColumn.tasks.findIndex(
        (task) => task.id === overId
      );
      reorderTasks(activeColumn.id, oldIndex, newIndex);
    }
  };

  // Вспомогательная функция для поиска колонки по ID задачи
  const findColumnByTaskId = (taskId) => {
    return columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
  };

  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
