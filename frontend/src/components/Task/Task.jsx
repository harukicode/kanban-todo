import React from "react";
import { Trash } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePriorityColor } from "@/hooks/usePriorityColor.jsx"; // Custom hook for priority color

/**
 * Task component displays an individual task within a column.
 * It shows the task's priority, title, and description.
 */
const Task = ({ task, onDelete }) => {
  // Get the appropriate color class for the task priority
  const priorityColorClass = usePriorityColor(task.priority);
  
  return (
    <Card className="mb-4 bg-zinc-100 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-start mb-2">
          {/* Tooltip displaying the priority label */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`capitalize text-xs px-1 py-0 min-w-14 h-7 ${priorityColorClass}`}
                >
                  {task.priority} {/* Display the task priority inside the button */}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{task.priority}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" className="ml-auto" onClick={() => onDelete(task.id)}>
            <Trash size={18}/>
          </Button>
        </div>
        
        {/* Task title */}
        <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
        
        {/* Task description */}
        <CardDescription className="text-sm">
          {task.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Task;