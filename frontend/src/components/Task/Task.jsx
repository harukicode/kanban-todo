import { useState } from "react";
import { Trash } from "lucide-react"
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
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx'

const Task = ({ task, isDragging }) => {
  const priorityColorClass = usePriorityColor(task.priority);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
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
  
  const handleTaskClick = () => {
    setIsModalOpen(true);
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
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); /* Implement delete logic */ }} className="p-0 h-auto">
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
        onUpdate={(updatedTask) => {/* Implement update logic */}}
      />
    </div>
  );
};

export default Task;