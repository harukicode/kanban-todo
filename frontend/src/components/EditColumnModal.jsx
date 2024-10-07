import React, { useState, useEffect } from "react"; // Importing React, useState and useEffect hooks
import {
  Modal,
  Input,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react"; // Importing components from NextUI

// EditColumnModal is a modal component for editing a column's title
const EditColumnModal = ({ isOpen, onClose, column, onSave }) => {
  // State to store the title of the column being edited
  const [title, setTitle] = useState(column ? column.title : "");

  // useEffect to update the title state whenever the column changes
  useEffect(() => {
    if (column) {
      setTitle(column.title); // Set title when a column is passed in
    }
  }, [column]); // Dependency on the column prop

  // Function to handle saving the updated column
  const handleSave = () => {
    if (column) {
      // Call onSave with the updated column object
      onSave({ ...column, title }); // Spread the existing column properties and update the title
    }
    onClose(); // Close the modal after saving
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      {" "}
      {/* Modal is controlled by isOpen and onClose props */}
      <ModalHeader>
        <h3>Edit Column</h3> {/* Modal title */}
      </ModalHeader>
      <ModalBody>
        {/* Input field for editing the column title */}
        <Input
          label="Column Title" // Label for the input
          value={title} // Bind the input value to the title state
          onChange={(e) => setTitle(e.target.value)} // Update title state on input change
        />
      </ModalBody>
      <ModalFooter>
        {/* Cancel button to close the modal without saving */}
        <Button auto flat color="error" onClick={onClose}>
          Cancel
        </Button>
        {/* Save button to trigger handleSave */}
        <Button auto onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditColumnModal; // Export the EditColumnModal component
