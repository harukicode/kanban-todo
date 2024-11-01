import { ColumnHeader } from '@/components/Column/ColumnHeader.jsx'
import ModalNewTask from '@/components/ModalNewTask/ModalNewTask.jsx'
import { TasksList } from '@/components/Task/TaskList.jsx'
import { useColumnModal } from '@/hooks/Column/useColumnModal.jsx'
import useSubtaskStore from '@/Stores/SubtaskStore.jsx'
import { useDroppable } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

export function Column({
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
  
  const { setNodeRef } = useDroppable({ id: columnId });
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [showColumnSubtasks, setShowColumnSubtasks] = useState(showAllSubtasks);
  const { updateSubtask, getSubtasksForTask } = useSubtaskStore();
  
  useEffect(() => {
    setShowColumnSubtasks(showAllSubtasks);
  }, [showAllSubtasks]);
  
  const handleToggleAllSubtasks = () => {
    setShowColumnSubtasks(!showColumnSubtasks);
  };
  
  const handleNameChange = (newName) => {
    updateColumn({ ...column, title: newName });
  };
  
  const handleColorChange = (newColor) => {
    updateColumn({ ...column, color: newColor });
  };
  
  const handleDeleteColumn = () => {
    deleteColumn(column.id);
  };
  
  const handleToggleDoneColumn = () => {
    const newDoneColumnState = !column.doneColumn;
    updateColumn({ ...column, doneColumn: newDoneColumnState });
    
    tasks.forEach((task) => {
      const subtasks = getSubtasksForTask(task.id);
      subtasks.forEach((subtask) => {
        updateSubtask(subtask.id, {
          completed: newDoneColumnState,
          completedAt: newDoneColumnState ? new Date().toISOString() : null,
        });
      });
    });
  };
  
  return (
    <div ref={setNodeRef} className="flex-grow w-72 min-h-[300px] flex flex-col overflow-hidden">
      <div className="mb-4 flex-grow flex flex-col">
        <ColumnHeader
          column={column}
          tasksCount={tasks.length}
          onAddTask={handleOpenModal}
          onToggleSubtasks={handleToggleAllSubtasks}
          showAllSubtasks={showAllSubtasks}
          propertiesOpen={propertiesOpen}
          setPropertiesOpen={setPropertiesOpen}
          onColorChange={handleColorChange}
          onNameChange={handleNameChange}
          onDeleteColumn={handleDeleteColumn}
          onToggleDoneColumn={handleToggleDoneColumn}
        />
        
        <TasksList
          tasks={tasks}
          columnId={columnId}
          showSubtasks={showColumnSubtasks}
          doneColumn={column.doneColumn}
        />
      </div>
      
      <ModalNewTask
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        addNewTask={addNewTask}
      />
    </div>
  );
}
