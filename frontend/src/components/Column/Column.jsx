import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Task from '../Task/Task';
import ModalNewTask from '../ModalNewTask/ModalNewTask';
import { ColumnPropertiesButton } from './ColumnPropertiesButton';
import { Button } from "@/components/ui/button"

const useModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	return { isOpen, open, close };
};

export default function Column({ column, addNewTask, updateColumnColor, deleteTask }) {
	const { isOpen: isModalOpen, open: handleOpenModal, close: handleCloseModal } = useModal();
	const [label, setLabel] = useState("feature");
	const [propertiesOpen, setPropertiesOpen] = useState(false);
	
	const handleColorChange = useCallback((newColor) => {
		updateColumnColor(column.id, newColor);
	}, [column.id, updateColumnColor]);
	
	const handleDeleteTask = useCallback((taskId) => {
		deleteTask(column.id, taskId);
	}, [column.id, deleteTask]);
	
	return (
		<div className="flex-grow w-72">
			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<h3
						className="text-sm font-semibold"
						style={{ color: column.color || 'inherit' }}
					>
						{column.title.toUpperCase()} {column.tasks?.length}
					</h3>
					<div className="flex items-center space-x-1">
						<Button variant="ghost" size="icon" onClick={handleOpenModal}>
							<Plus className="h-4 w-4" />
						</Button>
						<ColumnPropertiesButton
							label={label}
							setLabel={setLabel}
							open={propertiesOpen}
							setOpen={setPropertiesOpen}
							handleOpenModal={handleOpenModal}
							onColorChange={handleColorChange}
						/>
					</div>
				</div>
				<div
					className="h-0.5 w-full"
					style={{ backgroundColor: column.color || 'rgba(255, 255, 255, 0.1)' }}
				></div>
			</div>
			<div className="space-y-2">
				{column.tasks?.map((task) => (
					<Task key={task.id} task={task} onDelete={handleDeleteTask} />
				))}
			</div>
			<ModalNewTask
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				addNewTask={(task) => addNewTask(column.id, task)}
			/>
		</div>
	);
}