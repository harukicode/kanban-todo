import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import InputNewTask from "./InputNewTask";
import SetPriority from "../SetPriority/SetPriority";
import { Textarea } from "../ui/textarea"; // Adjust the path based on your structure


/**
 * ModalNewTask component manages the creation of a new task.
 * It includes inputs for task title, description, and priority.
 */
const ModalNewTask = ({ isOpen, onClose, addNewTask }) => {
  // State for storing task details
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("None");
  
  /**
   * Handles adding a new task by invoking the addTask prop function.
   */
  const handleAddTask = () => {
    if (taskTitle.trim() === "") {
      alert("Task title cannot be empty."); // Simple error handling
      return; // Prevent adding tasks without a title
    }
    
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
    };


    addNewTask(newTask); // Invoke the addTask function passed via props

    
    // Reset form fields
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("None");
  };
  
  return (
    <Modal open={isOpen} onClose={onClose} closeButton>
      <ModalHeader>Create New Task</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          {/* Task Title Input */}
          <InputNewTask
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          
          {/* Task Description Textarea */}
          <Textarea
            label="Description"
            placeholder="Enter description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="resize-none overflow-hidden min-h-[50px] focus:h-auto"
          />
          
          {/* Task Priority Selector */}
          <SetPriority
            selectedPriority={taskPriority}
            setSelectedPriority={setTaskPriority}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" onPress={handleAddTask}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};



export default ModalNewTask;
