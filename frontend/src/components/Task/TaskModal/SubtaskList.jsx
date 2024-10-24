import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

/**
 * SubtaskList Component
 * Displays and manages a list of subtasks for a task
 *
 * @param {Array} subtasks - Array of subtask objects
 * @param {number} completedSubtasks - Number of completed subtasks
 * @param {string} newSubtask - Value of the new subtask input
 * @param {Function} setNewSubtask - Function to update new subtask input
 * @param {Function} onSubtaskToggle - Function to toggle subtask completion
 * @param {Function} onAddSubtask - Function to add a new subtask
 * @param {Function} onDeleteSubtask - Function to delete a subtask
 */
export default function SubtaskList({
                                      subtasks,
                                      completedSubtasks,
                                      newSubtask,
                                      setNewSubtask,
                                      onSubtaskToggle,
                                      onAddSubtask,
                                      onDeleteSubtask,
                                    }) {
  // Handle enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddSubtask();
    }
  };
  
  return (
    <div>
      {/* Subtasks header */}
      <h3 className="text-lg font-semibold mb-2">
        Subtasks {completedSubtasks}/{subtasks.length}
      </h3>
      
      {/* Scrollable subtasks area */}
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`subtask-${subtask.id}`}
                  checked={subtask.completed}
                  onCheckedChange={() => onSubtaskToggle(subtask.id)}
                />
                <label
                  htmlFor={`subtask-${subtask.id}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    subtask.completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {subtask.title}
                </label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSubtask(subtask.id)}
              >
                <Trash size={14} />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Add new subtask input */}
      <div className="flex items-center space-x-2 mt-4">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new subtask..."
          className="flex-grow"
        />
        <Button onClick={onAddSubtask} size="sm">
          Add
        </Button>
      </div>
    </div>
  );
}