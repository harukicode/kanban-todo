import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskBubble from './TaskBubble';

const MAX_TASKS = 12;
const MAX_TASK_LENGTH = 20;

const COLORS = [
	{ name: 'Sky Blue', value: '#87CEEB', hover: '#7AB8D3' },
	{ name: 'Mint Green', value: '#98FF98', hover: '#89E589' },
	{ name: 'Peach', value: '#FFDAB9', hover: '#E5C4A7' },
	{ name: 'Lavender', value: '#E6E6FA', hover: '#CFCFE1' },
	{ name: 'Light Yellow', value: '#FFFACD', hover: '#E5E1B9' },
	{ name: 'Light Pink', value: '#FFB6C1', hover: '#E5A3AD' }
];

const GRID_POSITIONS = [
	{ id: 1, x: 15, y: 15 },    // Левый верхний
	{ id: 2, x: 65, y: 45 },    // Середина справа
	{ id: 3, x: 35, y: 25 },    // Верхняя часть слева
	{ id: 4, x: 82, y: 75 },    // Правый нижний
	{ id: 5, x: 25, y: 60 },    // Нижняя часть слева
	{ id: 6, x: 55, y: 20 },    // Верхняя часть центр
	{ id: 7, x: 12, y: 83 },    // Самый нижний слева
	{ id: 8, x: 79, y: 30 },    // Верхняя часть справа
	{ id: 9, x: 40, y: 80 },    // Нижняя часть
	{ id: 10, x: 6, y: 55 },   // Правый верхний
	{ id: 11, x: 20, y: 40 },   // Левая часть центр
	{ id: 12, x: 56, y: 65 },   // Правая часть низ
];

export default function MindMap({ onAddToTaskList }) {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const [selectedColor, setSelectedColor] = useState(COLORS[0]);
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
			gridPositionId: position.id,
			color: selectedColor.value,
			hoverColor: selectedColor.hover
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
	
	const handleTaskClick = (taskText) => {
		if (onAddToTaskList) {
			onAddToTaskList(taskText);
		}
	};
	
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="flex-row items-center justify-between px-6 py-4 border-b">
				<CardTitle className="text-xl font-semibold text-gray-800">Mind Map</CardTitle>
				<div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {tasks.length}/{MAX_TASKS} tasks
          </span>
					
					<div className="flex gap-2">
						{COLORS.map((color) => (
							<button
								key={color.value}
								onClick={() => setSelectedColor(color)}
								className={`w-6 h-6 rounded-full transition-all duration-200 ${
									selectedColor.value === color.value
										? 'ring-2 ring-purple-500 ring-offset-2'
										: 'hover:scale-110'
								}`}
								style={{ backgroundColor: color.value }}
								title={color.name}
							/>
						))}
					</div>
					
					<div className="relative">
						<input
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
							maxLength={MAX_TASK_LENGTH}
							disabled={tasks.length >= MAX_TASKS}
							className="px-4 py-2.5 rounded-full border border-gray-200 bg-white/75 backdrop-blur-sm hover:bg-white focus:bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 text-[15px] w-[280px] pr-16 transition-all duration-200"
							placeholder={tasks.length >= MAX_TASKS ? "Maximum tasks reached" : `Enter task (max ${MAX_TASK_LENGTH} chars)...`}
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              {newTask.length}/{MAX_TASK_LENGTH}
            </span>
					</div>
					
					<Button
						onClick={handleAddTask}
						disabled={tasks.length >= MAX_TASKS || !newTask.trim()}
						className="rounded-full px-4 py-2.5 bg-purple-500 text-white hover:bg-purple-600 shadow-sm disabled:opacity-50 disabled:hover:bg-purple-500"
						size="default"
					>
						<Plus className="h-5 w-5" />
					</Button>
				</div>
			</CardHeader>
			
			<CardContent className="relative flex-1 p-4">
				<AnimatePresence initial={false}>
					{tasks.map((task) => (
						<TaskBubble
							key={task.id}
							task={task.text}
							initialPosition={task.position}
							onRemove={() => handleRemoveTask(task.id)}
							color={task.color}
							onTaskClick={handleTaskClick}
						/>
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