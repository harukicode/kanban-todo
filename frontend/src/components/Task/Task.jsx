import { useState } from "react";
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
import useTaskStore from '@/Stores/TaskStore';  // Подключаем TaskStore для удаления и обновления

const Task = ({ task, columnId, isDragging }) => {
  const priorityColorClass = usePriorityColor(task.priority);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimer] = useState(false);
  
  const { deleteTask, updateTask } = useTaskStore();  // Получаем функции для удаления и обновления задач
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
    zIndex: isSortableDragging ? 1000 : 1,
  };
  
  // Открытие модального окна для редактирования задачи
  const handleTaskClick = () => {
    setIsModalOpen(true);
  };
  
  // Удаление задачи
  const handleDeleteTask = (e) => {
    e.stopPropagation();  // Останавливаем всплытие события, чтобы не открывалось модальное окно
    deleteTask(columnId, task.id);  // Удаляем задачу, передаем columnId и task.id
  };
  
  // Обновление задачи
  const handleUpdateTask = (updatedTask) => {
    updateTask(columnId, updatedTask);  // Вызываем функцию для обновления задачи в TaskStore
    setIsModalOpen(false);  // Закрываем модальное окно после обновления
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      {showTimer && (
        <div className="absolute right-full mr-4 top-0">
          <AddTimer />
        </div>
      )}
      <Card
        className={`mb-4 ${priorityColorClass} ${isDragging ? 'shadow-lg' : ''} transition-shadow duration-200`}
        onClick={handleTaskClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handleDeleteTask} className="p-0 h-auto">
                <Trash size={18}/>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onUpdate={handleUpdateTask}  // Передаем функцию обновления задачи в модальное окно
        onDelete={deleteTask}  // Передаем функцию удаления задачи в модальное окно
        columnId={columnId}
      />
    </div>
  );
};

import PropTypes from 'prop-types';

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    priority: PropTypes.string,
  }).isRequired,
  columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isDragging: PropTypes.bool,
};

export default Task;

