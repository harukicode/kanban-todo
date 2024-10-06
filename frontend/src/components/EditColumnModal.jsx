import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from "@nextui-org/react";

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
			<Modal.Header>
				<h3>Edit Column</h3>
			</Modal.Header>
			<Modal.Body>
				<Input
					label="Column Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button auto flat color="error" onClick={onClose}>
					Cancel
				</Button>
				<Button auto onClick={handleSave}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditColumnModal;