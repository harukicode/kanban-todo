import React, { useState } from "react"; // Importing React and the useState hook for managing state
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"; // Importing components from NextUI for modal and buttons
import InputNewTask from "./InputNewTask"; // Importing component for task title input
import SetPreority from "./Preority"; // Importing component for setting task priority
import { Textarea } from "@/components/ui/textarea"; // Importing Textarea component for task description

// ModalNewTask is a functional component that manages the modal for creating a new task
const ModalNewTask = ({ isOpen, onClose, addTask }) => {
  // State for storing task title
  const [taskTitle, setTaskTitle] = useState("");
  // State for storing task description
  const [taskDescription, setTaskDescription] = useState("");
  // State for storing task priority (default is 'None')
  const [taskPriority, setTaskPriority] = useState("None");

  // Function to handle adding a new task
  const handleAddTask = () => {
    // Calling the addTask function passed via props, passing in the new task data
    addTask({
      id: Date.now().toString(), // Generates a unique ID for the task using the current timestamp
      title: taskTitle, // The title of the task
      description: taskDescription, // The description of the task
      priority: taskPriority, // The priority of the task
    });
    onClose(); // Closes the modal after adding the task
  };

  return (
    // Modal component with backdrop blur effect, controlled by isOpen and onClose props
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      {/* Modal content */}
      <ModalContent>
        {(onClose) => (
          <>
            {/* Modal header with the title */}
            <ModalHeader className="flex flex-col gap-1">
              Create new task
            </ModalHeader>
            {/* Modal body where the input fields are rendered */}
            <ModalBody>
              <div className="flex flex-col gap-4">
                {/* Task title input component */}
                <InputNewTask
                  value={taskTitle} // Binding the taskTitle state to the input value
                  onChange={(e) => setTaskTitle(e.target.value)} // Updating the taskTitle state on input change
                />
                {/* Textarea for the task description */}
                <Textarea
                  label="Description" // Label for the textarea input
                  placeholder="Enter description" // Placeholder text for the textarea
                  value={taskDescription} // Binding the taskDescription state to the textarea value
                  onChange={(e) => setTaskDescription(e.target.value)} // Updating the taskDescription state on change
                  className="resize-none overflow-hidden min-h-[50px] focus:h-auto" // Tailwind classes for styling and dynamic height
                />
                {/* Component for setting task priority */}
                <SetPreority
                  selectedPriority={taskPriority} // Passing the current priority state
                  setSelectedPriority={setTaskPriority} // Updating the taskPriority state when changed
                />
              </div>
            </ModalBody>
            {/* Modal footer with action buttons */}
            <ModalFooter>
              {/* Button to close the modal */}
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {/* Button to confirm and add the task */}
              <Button color="primary" onPress={handleAddTask}>
                Done
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalNewTask;
