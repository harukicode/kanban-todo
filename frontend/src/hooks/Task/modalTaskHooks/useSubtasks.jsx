import { useState } from 'react';

export function useSubtasks(editedTask, setEditedTask) {
	const [newSubtask, setNewSubtask] = useState('');
	
	const completedSubtasks = editedTask.subtasks.filter(subtask => subtask.completed).length;
	
	const handleSubtaskToggle = (index) => {
		const updatedSubtasks = [...editedTask.subtasks];
		updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
		setEditedTask({ ...editedTask, subtasks: updatedSubtasks });
	};
	
	const handleAddSubtask = () => {
		if (newSubtask.trim()) {
			setEditedTask({
				...editedTask,
				subtasks: [...editedTask.subtasks, { title: newSubtask, completed: false }]
			});
			setNewSubtask('');
		}
	};
	
	return {
		subtasks: editedTask.subtasks,
		completedSubtasks,
		newSubtask,
		setNewSubtask,
		handleSubtaskToggle,
		handleAddSubtask
	};
}