import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function SubtaskList({
  subtasks,
  completedSubtasks,
  newSubtask,
  setNewSubtask,
  onSubtaskToggle,
  onAddSubtask,
  onDeleteSubtask,
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Subtasks {completedSubtasks}/{subtasks.length}
      </h3>
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
      <div className="flex items-center space-x-2 mt-4">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
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
