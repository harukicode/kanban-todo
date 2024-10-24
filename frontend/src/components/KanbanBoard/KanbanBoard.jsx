import Header from "./Header";
import useColumnsStore from "@/Stores/ColumnsStore";
import useProjectStore from "@/Stores/ProjectsStore";
import useTaskStore from "@/Stores/TaskStore";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { useMemo, useState, useCallback } from "react";
import { useKanbanDnD } from "@/hooks/KanbanBoard/useKanbanDnD";
import { useFilteredTasks } from "@/hooks/KanbanBoard/useFilteredTasks";
import Column from "../Column/Column";
import Task from "../Task/Task";

export default function KanbanBoard() {
  const { columns, setColumns, addColumn, deleteColumn, updateColumn } =
    useColumnsStore(); // Получаем колонки
  const { activeProjectId } = useProjectStore(); // Получаем активный проект
  const [priorityFilter, setPriorityFilter] = useState("all"); // Фильтр по приоритету
  const { moveTask, addTask } = useTaskStore(); // Получаем функцию перемещения задачи
  const [showSubtasksForAllColumns, setShowSubtasksForAllColumns] = useState(false);
  
  // Функция для переключения показа всех подзадач
  const toggleShowSubtasksForAllColumns = () => {
    setShowSubtasksForAllColumns(!showSubtasksForAllColumns);
  };
  
  // Функция reorderTasks для перемещения задач в колонке
  const reorderTasks = useCallback(
    (columnId, oldIndex, newIndex) => {
      const updatedColumns = columns.map((column) => {
        if (column.id === columnId) {
          const updatedTasks = Array.from(column.tasks);
          const [movedTask] = updatedTasks.splice(oldIndex, 1);
          updatedTasks.splice(newIndex, 0, movedTask);
          return { ...column, tasks: updatedTasks };
        }
        return column;
      });
      setColumns(updatedColumns); // Обновляем состояние колонок
    },
    [columns, setColumns]
  );
  // Инициализация DnD
  const {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useKanbanDnD({
    columns,
    moveTask,
    reorderTasks,
  });

  // Фильтрация колонок по проекту
  const projectFilteredColumns = useMemo(() => {
    return columns.filter((column) => column.projectId === activeProjectId);
  }, [columns, activeProjectId]);

  // Фильтрация задач по приоритету
  const filteredColumns = useFilteredTasks(
    projectFilteredColumns,
    priorityFilter
  );

  // Добавление новой колонки
  const addNewColumn = useCallback(() => {
    const newColumn = {
      title: "New Column",
      tasks: [],
      color: "#6b7280",
      projectId: activeProjectId,
    };
    addColumn(newColumn);
  }, [addColumn, activeProjectId]);

  // Добавление новой задачи
  const handleAddNewTask = useCallback(
    (columnId, newTask) => {
      addTask(columnId, { ...newTask, projectId: activeProjectId });
    },
    [addTask, activeProjectId]
  );

  return (
    <div className="kanban-board p-4">
      <Header
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onAddColumn={addNewColumn}
        toggleShowAllSubtasks={toggleShowSubtasksForAllColumns}
        showAllSubtasks={showSubtasksForAllColumns} // Передаем состояние в Header
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-4 pb-4 overflow-x-auto">
          {filteredColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              columnId={column.id}
              tasks={column.tasks}
              addNewTask={(task) => handleAddNewTask(column.id, task)}
              updateColumn={updateColumn}
              deleteColumn={deleteColumn}
              showAllSubtasks={showSubtasksForAllColumns} // Передаем глобальное состояние в каждую колонку
            
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <Task
              task={activeTask}
              columnId={
                activeTask.columnId ||
                columns.find((col) =>
                  col.tasks.some((t) => t.id === activeTask.id)
                )?.id
              }
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
