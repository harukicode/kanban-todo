import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const EditColumnModal = ({ isOpen, onClose, column, onSave }) => {
	const [title, setTitle] = useState(column ? column.title : '');
	
	useEffect(() => {
		if (column) {
			setTitle(column.title);
		}
	}, [column]);
	
	const handleSave = () => {
		if (column) {
			onSave({ ...column, title });
		}
		onClose();
	};
	
	return (
		<Modal open={isOpen} onClose={onClose}>
			<ModalHeader>
				<h3>Edit Column</h3>
			</ModalHeader>
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