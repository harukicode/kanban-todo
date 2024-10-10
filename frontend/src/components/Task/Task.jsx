import React, { useState } from "react";
import { Trash } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePriorityColor } from "@/hooks/usePriorityColor.jsx";
import TaskModal from "./TaskModal";
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx'

const Task = ({ task, onDelete, onUpdate }) => {
  const priorityColorClass = usePriorityColor(task.priority);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
  const handleTaskClick = () => {
    setIsModalOpen(true);
  };
  
  const handleTimerToggle = (e) => {
    e.stopPropagation();
    setShowTimer(!showTimer);
  };
  
  return (
    <div className="relative">
      {showTimer && (
        <div className="absolute right-full mr-4 top-0">
          <AddTimer />
        </div>
      )}
      <Card
        className={`mb-4 ${priorityColorClass} cursor-pointer`}
        onClick={handleTaskClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-0 h-auto">
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
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default Task;