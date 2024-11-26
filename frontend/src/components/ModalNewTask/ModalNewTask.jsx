import { Label } from "@/components/ui/label.jsx";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import InputNewTask from "./InputNewTask";
import SetPriority from "./SetPriority";

const ModalNewTask = ({ isOpen, onClose, addNewTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("none");

  const handleAddTask = () => {
    if (taskTitle.trim() === "") {
      alert("Task title cannot be empty.");
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
    };
    addNewTask(newTask);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("None");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <InputNewTask
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <Label htmlFor="taskInput" className="text-sm font-medium ">
            Description name (optional)
          </Label>
          <Textarea
            placeholder="Enter description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="resize-none overflow-hidden min-h-[50px] focus:h-auto mt-2 mb-4"
          />
          <SetPriority
            selectedPriority={taskPriority}
            setSelectedPriority={setTaskPriority}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleAddTask}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNewTask;
