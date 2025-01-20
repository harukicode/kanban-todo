import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskBubble from './TaskBubble';

const MAX_TASKS = 44;
const MAX_TASK_LENGTH = 20;

const COLORS = [
	{ name: 'Sky Blue', value: '#87CEEB', hover: '#7AB8D3' },
	{ name: 'Mint Green', value: '#98FF98', hover: '#89E589' },
	{ name: 'Peach', value: '#FFDAB9', hover: '#E5C4A7' },
	{ name: 'Lavender', value: '#E6E6FA', hover: '#CFCFE1' },
	{ name: 'Light Yellow', value: '#FFFACD', hover: '#E5E1B9' },
	{ name: 'Light Pink', value: '#FFB6C1', hover: '#E5A3AD' }
];

export default function MindMap({ onAddToTaskList }) {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const [selectedColor, setSelectedColor] = useState(COLORS[0]);
	
	const handleAddTask = () => {
		if (!newTask.trim() || tasks.length >= MAX_TASKS) return;
		
		const newTaskObj = {
			id: Date.now().toString(),
			text: newTask.trim().slice(0, MAX_TASK_LENGTH),
			color: selectedColor.value,
			hoverColor: selectedColor.hover
		};
		
		setTasks(prevTasks => [...prevTasks, newTaskObj]);
		setNewTask('');
	};
	
	const handleRemoveTask = (taskId) => {
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
			
			<CardContent className="flex-1 p-4 overflow-auto">
				<div className="flex flex-wrap gap-4">
					<AnimatePresence initial={false}>
						{tasks.map((task) => (
							<TaskBubble
								key={task.id}
								task={task.text}
								color={task.color}
								onRemove={() => handleRemoveTask(task.id)}
								onTaskClick={handleTaskClick}
							/>
						))}
					</AnimatePresence>
				</div>
				
				{tasks.length === 0 && (
					<div className="h-full flex items-center justify-center text-gray-400">
						Add tasks to start building your mind map
					</div>
				)}
			</CardContent>
		</Card>
	);
}