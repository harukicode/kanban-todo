import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskBubble from './TaskBubble';

const MAX_TASKS = 12;
const MAX_TASK_LENGTH = 20;

// Сетка с хаотичным расположением ячеек
const GRID_POSITIONS = [
	{ id: 1, x: 15, y: 25 },
	{ id: 2, x: 60, y: 55 },
	{ id: 3, x: 35, y: 10 },
	{ id: 4, x: 80, y: 70 },
	{ id: 5, x: 25, y: 45 },
	{ id: 6, x: 50, y: 30 },
	{ id: 7, x: 10, y: 65 },
	{ id: 8, x: 75, y: 20 },
	{ id: 9, x: 40, y: 60 },
	{ id: 10, x: 65, y: 40 },
	{ id: 11, x: 20, y: 75 },
	{ id: 12, x: 55, y: 15 },
];

export default function MindMap() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const [occupiedPositions, setOccupiedPositions] = useState(new Set());
	
	const getRandomAvailablePosition = () => {
		const availablePositions = GRID_POSITIONS.filter(pos => !occupiedPositions.has(pos.id));
		if (availablePositions.length === 0) return null;
		
		const randomIndex = Math.floor(Math.random() * availablePositions.length);
		return availablePositions[randomIndex];
	};
	
	const handleAddTask = () => {
		if (!newTask.trim() || tasks.length >= MAX_TASKS) return;
		
		const position = getRandomAvailablePosition();
		if (!position) return;
		
		const newTaskObj = {
			id: Date.now().toString(),
			text: newTask.trim().slice(0, MAX_TASK_LENGTH),
			position: {
				x: `${position.x}%`,
				y: `${position.y}%`
			},
			gridPositionId: position.id
		};
		
		setTasks(prevTasks => [...prevTasks, newTaskObj]);
		setOccupiedPositions(prev => new Set([...prev, position.id]));
		setNewTask('');
	};
	
	const handleRemoveTask = (taskId) => {
		const taskToRemove = tasks.find(task => task.id === taskId);
		if (taskToRemove) {
			setOccupiedPositions(prev => {
				const newSet = new Set(prev);
				newSet.delete(taskToRemove.gridPositionId);
				return newSet;
			});
		}
		setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
	};
	
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="flex-row items-center justify-between p-4">
				<CardTitle className="m-0">Mind Map</CardTitle>
				<div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {tasks.length}/{MAX_TASKS} tasks
          </span>
					<div className="relative">
						<input
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
							maxLength={MAX_TASK_LENGTH}
							disabled={tasks.length >= MAX_TASKS}
							className="px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm w-[250px] pr-16"
							placeholder={tasks.length >= MAX_TASKS ? "Maximum tasks reached" : `Enter task (max ${MAX_TASK_LENGTH} chars)...`}
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {newTask.length}/{MAX_TASK_LENGTH}
            </span>
					</div>
					<Button
						onClick={handleAddTask}
						disabled={tasks.length >= MAX_TASKS || !newTask.trim()}
						className="rounded-full bg-purple-500 text-white hover:bg-purple-600 shadow-sm"
						size="sm"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			
			<CardContent className="relative flex-1  p-4">
				<AnimatePresence>
					{tasks.map((task) => (
						<motion.div
							key={task.id}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{
								type: "spring",
								duration: 0.5,
								bounce: 0.3
							}}
							className="task-bubble animate absolute"
							style={{
								left: task.position.x,
								top: task.position.y,
								transform: 'translate(-50%, -50%)',
								willChange: 'transform'
							}}
						>
							<TaskBubble
								task={task.text}
								initialPosition={task.position}
								onRemove={() => handleRemoveTask(task.id)}
							/>
						</motion.div>
					))}
				</AnimatePresence>
				
				{tasks.length === 0 && (
					<div className="absolute inset-0 flex items-center justify-center text-gray-400">
						Add tasks to start building your mind map
					</div>
				)}
			</CardContent>
		</Card>
	);
}