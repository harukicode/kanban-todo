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
			<CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 border-b gap-4">
				<CardTitle className="text-xl font-semibold text-gray-800">Mind Map</CardTitle>
				<div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {tasks.length}/{MAX_TASKS_LIMIT} tasks
          </span>
					
					<div className="flex gap-2 flex-wrap">
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
					
					<div className="flex-1 md:flex-none flex items-center gap-2 w-full md:w-auto">
						<input
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && addTask()}
							maxLength={MAX_TASK_LENGTH_LIMIT}
							disabled={tasks.length >= MAX_TASKS_LIMIT}
							className="w-full md:w-[280px] px-4 py-2.5 rounded-full border border-gray-200 bg-white/75 backdrop-blur-sm hover:bg-white focus:bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 text-[15px]"
							placeholder={
								tasks.length >= MAX_TASKS_LIMIT
									? "Maximum tasks reached"
									: `Enter task (max ${MAX_TASK_LENGTH_LIMIT} chars)...`
							}
						/>
						<Button
							onClick={addTask}
							disabled={tasks.length >= MAX_TASKS_LIMIT || !newTask.trim()}
							className="shrink-0 rounded-full px-4 py-2.5 bg-purple-500 text-white hover:bg-purple-600 shadow-sm disabled:opacity-50 disabled:hover:bg-purple-500"
							size="default"
						>
							<Plus className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</CardHeader>
			
			<CardContent className="flex-1 p-4 overflow-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 h-full auto-rows-[minmax(80px,auto)]">
					<AnimatePresence initial={false}>
						{tasks.map((task) => (
							<motion.div
								key={task.id}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className="flex items-stretch min-w-[100px] h-12"
							>
								<TaskBubble
									task={task.text}
									color={task.color}
									onRemove={() => removeTask(task.id)}
									onTaskClick={handleTaskClick}
								/>
							</motion.div>
						))}
					</AnimatePresence>
					
					{tasks.length === 0 && (
						<div className="col-span-full h-full flex items-center justify-center text-gray-400">
							Add tasks to start building your mind map
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}