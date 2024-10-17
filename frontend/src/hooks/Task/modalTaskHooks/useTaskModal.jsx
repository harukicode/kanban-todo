import { useState } from 'react';

export function useTaskModal(task, onUpdate, onClose) {
	const [editedTask, setEditedTask] = useState({
		...task,
		subtasks: task.subtasks || []
	});
	
	const handleSave = () => {
		onUpdate(editedTask);
		onClose();
	};
	
	const handleClose = () => {
		onClose();
	};
	
	return { editedTask, setEditedTask, handleSave, handleClose };
}