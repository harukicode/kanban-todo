import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePriorityColor } from "@/hooks/taskHooks/usePriorityColor.jsx";
import TaskModal from "./TaskModal/TaskModal.jsx";
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx';
import useTaskStore from '@/Stores/TaskStore';

// Используем параметры по умолчанию вместо defaultProps
const Task = ({
                task,
                columnId,
                isDragging = false,
                isSelectingTaskForTimer = false,
                onTaskSelect = () => {},
              }) => {
  const priorityColorClass = usePriorityColor(task.priority);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimer] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  const handleClick = () => {
    if (isSelectingTaskForTimer) {
      onTaskSelect(task);
    } else {
      handleTaskClick();
    }
  };
  
  const { deleteTask, updateTask } = useTaskStore();
  
  useEffect(() => {
    if (!columnId && !task.columnId) {
      console.warn('Task rendered without columnId:', task);
    }
  }, [columnId, task]);
  
  const actualColumnId = columnId || task.columnId;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      ...task,
      columnId: actualColumnId
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
    zIndex: isSortableDragging ? 1000 : 1,
  };
  
  const handleTaskClick = () => {
    if (!isDeleted) {
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteTask = async (e) => {
    if (e) {
      e.stopPropagation();
    }
    if (!actualColumnId) {
      console.error('Cannot delete task: columnId is undefined', task);
      return;
    }
    
    try {
      setIsDeleted(true);
      await deleteTask(actualColumnId, task.id);
    } catch (error) {
      setIsDeleted(false);
      console.error('Error deleting task:', error);
    }
  };
  
  const handleUpdateTask = (updatedTask) => {
    if (!actualColumnId) {
      console.error('Cannot update task: columnId is undefined', task);
      return;
    }
    updateTask(actualColumnId, updatedTask);
    setIsModalOpen(false);
  };
  
  if (isDeleted) {
    return null;
  }
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      {showTimer && (
        <div className="absolute right-full mr-2 top-0">
          <AddTimer />
        </div>
      )}
      <Card
        className={`mb-2 ${priorityColorClass} ${isDragging ? 'shadow-lg' : ''} ${
          isSelectingTaskForTimer ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' : ''
        } transition-shadow duration-200`}
        onClick={handleClick}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate mr-2">{task.title}</CardTitle>
            {!isSelectingTaskForTimer && (
              <Button
                variant="ghost"
                onClick={handleDeleteTask}
                className="p-0 h-auto"
                disabled={isDeleted}
              >
                <Trash size={14} />
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
      {!isDeleted && !isSelectingTaskForTimer && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={task}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          columnId={actualColumnId}
        />
      )}
    </div>
  );
}

import PropTypes from 'prop-types';

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    priority: PropTypes.string,
    columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDragging: PropTypes.bool,
};

export default Task;