import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from "@nextui-org/react";
import { Plus } from 'lucide-react';
import Task from './Task';
import ModalNewTask from './ModalNewTask';

const Column = ({ column, editColumnTitle, deleteColumn, addTask }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	
	return (
		<div className="flex-grow w-72">
			<Card isBlurred className="border-none max-w-[610px] shadow-md" style={{ backgroundColor: `${column.color}20` }}>
				<CardHeader className="flex justify-between items-center">
					<ColumnHeader column={column} editColumnTitle={editColumnTitle} />
				</CardHeader>
				<CardBody className="overflow-y-auto">
					{column.tasks && column.tasks.map(task => <Task key={task.id} task={task} />)}
				</CardBody>
				<CardFooter>
					<Button fullWidth color="primary" variant="light" startContent={<Plus size={16} />} onClick={handleOpenModal}>
						Add Task
					</Button>
				</CardFooter>
			</Card>
			<ModalNewTask isOpen={isModalOpen} onClose={handleCloseModal} addTask={(task) => addTask(column.id, task)} />
		</div>
	);
};

const ColumnHeader = ({ column, editColumnTitle }) => (
	<div className="flex items-center">
		<div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: column.color, marginRight: '2px' }}></div>
		<h3 className="text-lg font-semibold m-3">{column.title}</h3>
		{editColumnTitle && <Button auto flat onClick={() => editColumnTitle(column)}>Edit</Button>}
	</div>
);

export default Column;