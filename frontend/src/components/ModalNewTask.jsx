import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import InputNewTask from './InputNewTask';
import SetPreority from './Preority';
import { Textarea } from "@/components/ui/textarea"

const ModalNewTask = ({ isOpen, onClose, addTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("None");
  
  const handleAddTask = () => {
    addTask({ id: Date.now().toString(), title: taskTitle, description: taskDescription, priority: taskPriority });
    onClose();
  };
  
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create new task</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <InputNewTask value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="resize-none overflow-hidden min-h-[50px] focus:h-auto" // Tailwind classes
                />
                <SetPreority selectedPriority={taskPriority} setSelectedPriority={setTaskPriority} />
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalNewTask;