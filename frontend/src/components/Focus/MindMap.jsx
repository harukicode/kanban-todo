import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TaskBubble from "./TaskBubble"
import { useMindMapStore, MAX_TASKS_LIMIT, MAX_TASK_LENGTH_LIMIT } from "@/Stores/MindMapStore.jsx"

export default function MindMap({ onAddToTaskList }) {
	const { tasks, newTask, selectedColor, colors, setNewTask, addTask, removeTask, setSelectedColor } = useMindMapStore()
	
	const handleTaskClick = (taskText) => {
		if (onAddToTaskList) {
			onAddToTaskList(taskText)
		}
	}
	
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="flex-row items-center justify-between px-6 py-4 border-b">
				<CardTitle className="text-xl font-semibold text-gray-800">Mind Map</CardTitle>
				<div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {tasks.length}/{MAX_TASKS_LIMIT} tasks
          </span>
					
					<div className="flex gap-2">
						{colors.map((color) => (
							<button
								key={color.value}
								onClick={() => setSelectedColor(color)}
								className={`w-6 h-6 rounded-full transition-all duration-200 ${
									selectedColor.value === color.value ? "ring-2 ring-purple-500 ring-offset-2" : "hover:scale-110"
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
							onKeyPress={(e) => e.key === "Enter" && addTask()}
							maxLength={MAX_TASK_LENGTH_LIMIT}
							disabled={tasks.length >= MAX_TASKS_LIMIT}
							className="px-4 py-2.5 rounded-full border border-gray-200 bg-white/75 backdrop-blur-sm hover:bg-white focus:bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 text-[15px] w-[280px] pr-16 transition-all duration-200"
							placeholder={
								tasks.length >= MAX_TASKS_LIMIT
									? "Maximum tasks reached"
									: `Enter task (max ${MAX_TASK_LENGTH_LIMIT} chars)...`
							}
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              {newTask.length}/{MAX_TASK_LENGTH_LIMIT}
            </span>
					</div>
					
					<Button
						onClick={addTask}
						disabled={tasks.length >= MAX_TASKS_LIMIT || !newTask.trim()}
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
								onRemove={() => removeTask(task.id)}
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
	)
}

