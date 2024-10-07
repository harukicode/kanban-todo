import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from "@nextui-org/react";
import { Plus } from 'lucide-react';
import Task from '../Task/Task';
import ModalNewTask from '../ModalNewTask/ModalNewTask';
import ColumnHeader from './ColumnHeader';


const Column = ({ column, editColumnTitle, addNewTask }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	
	return (
		<div className="flex-grow w-72">
			<Card
				isBlurred
				className="border-none max-w-[610px] shadow-md"
				style={{ backgroundColor: `${column.color}20` }}
			>
				<CardHeader className="flex flex-col items-start">
					<ColumnHeader
						column={column}
						editColumnTitle={editColumnTitle}
					/>
					<div
						className="w-full h-[2px] mt-2"
						style={{ backgroundColor: column.color }}
					></div>
				</CardHeader>
				<CardBody className="overflow-y-auto">
					{column.tasks && column.tasks.map((task) => (
						<Task key={task.id} task={task} />
					))}
				</CardBody>
				<CardFooter>
					<Button
						fullWidth
						color="primary"
						variant="light"
						startContent={<Plus size={16} />}
						onClick={handleOpenModal}
					>
						Add Task
					</Button>
				</CardFooter>
			</Card>
			<ModalNewTask
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				addNewTask={(task) => addNewTask(column.id, task)}
			/>
		</div>
	);
};



export default Column;