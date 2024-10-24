import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import ModalNewTask from "@/components/ModalNewTask/ModalNewTask";
import { ColumnPropertiesButton } from "./ColumnPropertiesButton";
import { Button } from "@/components/ui/button";
import { useColumnModal } from "@/hooks/Column/useColumnModal";
import React, { useEffect, useState } from 'react'
import Task from "@/components/Task/Task";
import useSubtaskStore from "@/Stores/SubtaskStore";

export default function Column({
  column,
  columnId,
  tasks,
  addNewTask,
  updateColumn,
  deleteColumn,
  showAllSubtasks,
}) {
  const {
    isOpen: isModalOpen,
    open: handleOpenModal,
    close: handleCloseModal,
  } = useColumnModal();
  const { setNodeRef } = useDroppable({
    id: columnId,
  });
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [showColumnSubtasks, setShowColumnSubtasks] = useState(showAllSubtasks); // Локальное состояние
  const { updateSubtask, getSubtasksForTask } = useSubtaskStore();
  
  // Синхронизируем локальное состояние с глобальным
  useEffect(() => {
    setShowColumnSubtasks(showAllSubtasks);
  }, [showAllSubtasks]);
  
  // Переключение отображения подзадач только для этой колонки
  const handleToggleAllSubtasks = () => {
    setShowColumnSubtasks(!showColumnSubtasks);
  };
  
  // Изменение заголовка колонки
  const handleNameChange = (newName) => {
    updateColumn({ ...column, title: newName });
  };

  // Изменение цвета колонки
  const handleColorChange = (newColor) => {
    updateColumn({ ...column, color: newColor });
  };

  // Удаление колонки
  const handleDeleteColumn = () => {
    deleteColumn(column.id);
  };
  
  // Обработчик переключения doneColumn
  const handleToggleDoneColumn = () => {
    const newDoneColumnState = !column.doneColumn; // Переключаем состояние doneColumn
    updateColumn({ ...column, doneColumn: newDoneColumnState });
    
    console.log("Column state changed to:", newDoneColumnState); // Логируем новое состояние колонки
    
    // Если колонка помечена как выполненная, обновляем все подзадачи для всех задач
    tasks.forEach((task) => {
      const subtasks = getSubtasksForTask(task.id); // Получаем подзадачи для задачи из хранилища
      console.log(`Subtasks for task ${task.id}:`, subtasks); // Логируем подзадачи задачи
      
      subtasks.forEach((subtask) => {
        // Обновляем состояние каждой подзадачи в хранилище
        updateSubtask(subtask.id, {
          completed: newDoneColumnState, // Обновляем состояние подзадачи
          completedAt: newDoneColumnState ? new Date().toISOString() : null,
        });
        console.log(`Subtask ${subtask.id} updated:`, {
          completed: newDoneColumnState,
          completedAt: newDoneColumnState ? new Date().toISOString() : null,
        }); // Логируем обновление подзадачи
      });
    });
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-grow w-72 min-h-[300px] flex flex-col overflow-hidden"
    >
      <div className="mb-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2 pb-2 relative">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: column.color || "inherit" }}
            />
            <h3
              className="text-sm font-semibold"
              style={{ color: column.color || "inherit" }}
            >
              {column.title} ({tasks.length})
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={handleOpenModal}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button onClick={handleToggleAllSubtasks} variant={"ghost"}>
              {showAllSubtasks ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </Button>
            <ColumnPropertiesButton
              open={propertiesOpen}
              setOpen={setPropertiesOpen}
              handleOpenModal={handleOpenModal}
              onColorChange={handleColorChange}
              onNameChange={handleNameChange}
              columnName={column.title}
              onDeleteColumn={handleDeleteColumn}
              doneColumn={column.doneColumn} // Передаём текущее состояние doneColumn
              onToggleDoneColumn={handleToggleDoneColumn} // Передаём функцию переключения
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: column.color || "inherit" }}
          />
        </div>
        <div className="space-y-2 flex-grow">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <Task key={task.id} task={task} columnId={columnId} showSubtasks={showColumnSubtasks} doneColumn={column.doneColumn} />
            ))}
          </SortableContext>
        </div>
      </div>
      <ModalNewTask
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        addNewTask={addNewTask}
      />
    </div>
  );
}
