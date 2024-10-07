import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";


/**
 * EditColumnModal component provides a modal dialog to edit a column's title.
 */
const EditColumnModal = ({ isOpen, onClose, column, onSave }) => {
  // State to store the updated title
  const [title, setTitle] = useState("");
  
  // Update the title when the column prop changes
  useEffect(() => {
    if (column) {
      setTitle(column.title);
    }
  }, [column]);
  
  /**
   * Handles saving the updated column title.
   */
  const handleSave = () => {
    if (column) {
      onSave({ ...column, title: title.trim() });
    }
    onClose();
  };
  
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader>Edit Column</ModalHeader>
      <ModalBody>
        <Input
          label="Column Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button auto flat color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button auto onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};



export default EditColumnModal;
