import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Task from '../Task/Task';
import ModalNewTask from '../ModalNewTask/ModalNewTask';
import { ColumnPropertiesButton } from './ColumnPropertiesButton';
import { Button } from "@/components/ui/button";
import useColumnsStore from '@/Stores/ColumnsStore.jsx';
import useProjectStore from '@/Stores/ProjectsStore.jsx';

const useModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	return { isOpen, open, close };
};

export default function Column({ column, tasks, addNewTask }) {
	const { isOpen: isModalOpen, open: handleOpenModal, close: handleCloseModal } = useModal();
	const [propertiesOpen, setPropertiesOpen] = useState(false);
	const { updateColumn, deleteColumn } = useColumnsStore();
	const { activeProjectId } = useProjectStore();
	
	const { setNodeRef } = useDroppable({
		id: column.id,
	});
	
	const handleAddTask = (newTask) => {
		addNewTask({ ...newTask, projectId: activeProjectId });
		handleCloseModal();
	};
	
	const handleNameChange = (newName) => {
		updateColumn({ ...column, title: newName });
	};
	
	const handleColorChange = (newColor) => {
		updateColumn({ ...column, color: newColor });
	};
	
	const handleDeleteColumn = () => {
		deleteColumn(column.id);
	};
	
	return (
		<div ref={setNodeRef} className="flex-grow w-72 min-h-[300px] flex flex-col">
			<div className="mb-4 flex-grow flex flex-col">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-semibold" style={{ color: column.color || 'inherit' }}>
						{column.title.toUpperCase()} ({tasks.length})
					</h3>
					<div className="flex items-center space-x-1">
						<Button variant="ghost" size="icon" onClick={handleOpenModal}>
							<Plus className="h-4 w-4" />
						</Button>
						<ColumnPropertiesButton
							open={propertiesOpen}
							setOpen={setPropertiesOpen}
							handleOpenModal={handleOpenModal}
							onColorChange={handleColorChange}
							onNameChange={handleNameChange}
							columnName={column.title}
							onDeleteColumn={handleDeleteColumn}
						/>
					</div>
				</div>
				<div className="space-y-2 flex-grow">
					<SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
						{tasks.map((task) => (
							<Task key={task.id} task={task} />
						))}
					</SortableContext>
				</div>
			</div>
			<ModalNewTask
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				addNewTask={handleAddTask}
			/>
		</div>
	);
}

Column.propTypes = {
	column: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		title: PropTypes.string.isRequired,
		color: PropTypes.string,
	}).isRequired,
	tasks: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})).isRequired,
	addNewTask: PropTypes.func.isRequired,
};