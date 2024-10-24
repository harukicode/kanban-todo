import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import useSubtaskStore from "@/Stores/SubtaskStore";

export default function SubtaskList({ taskId }) {
  // Access subtask store
  const {
    getSubtasksForTask,
    getSubtaskStats,
    addSubtask,
    toggleSubtask,
    deleteSubtask
  } = useSubtaskStore();
  
  // Local state for new subtask input
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  
  // Get subtasks and stats
  const subtasks = getSubtasksForTask(taskId);
  const { completed, total } = getSubtaskStats(taskId);
  
  /**
   * Handles adding a new subtask
   * @param {Event} e - Optional event object
   */
  const handleAddSubtask = (e) => {
    e?.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(taskId, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
    }
  };
  
  return (
    <div>
      {/* Subtasks header */}
      <h3 className="text-lg font-semibold mb-2">
        Subtasks {completed}/{total}
      </h3>
      
      {/* Scrollable subtasks area */}
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`subtask-${subtask.id}`}
                  checked={subtask.completed}
                  onCheckedChange={() => toggleSubtask(subtask.id)}
                />
                <label
                  htmlFor={`subtask-${subtask.id}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed
                    peer-disabled:opacity-70 ${
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
                onClick={() => deleteSubtask(subtask.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={14} />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Add new subtask form */}
      <form
        onSubmit={handleAddSubtask}
        className="flex items-center space-x-2 mt-4"
      >
        <Input
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add new subtask..."
          className="flex-grow"
        />
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
    </div>
  );
}