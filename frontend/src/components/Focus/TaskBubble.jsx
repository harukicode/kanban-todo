import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const TaskBubble = ({ task, color, onRemove, onTaskClick }) => {
	const handleClick = (e) => {
		e.stopPropagation()
		if (onTaskClick) {
			onTaskClick(task)
		}
	}
	
	return (
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 25,
				mass: 1,
			}}
			style={{ backgroundColor: color }}
			className="group inline-flex items-center justify-center gap-2 rounded-full shadow-[0_4px_12px_-3px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)] px-4 py-2.5 border border-gray-100/50 backdrop-blur-sm transition-shadow duration-300 cursor-pointer whitespace-nowrap w-full"
			onClick={handleClick}
		>
      <span className="text-[15px] font-medium text-gray-700 tracking-tight truncate" title={task}>
        {task}
      </span>
			<Button
				variant="ghost"
				size="sm"
				className="h-3 w-3 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 flex-shrink-0"
				onClick={(e) => {
					e.stopPropagation()
					onRemove()
				}}
			>
				<X className="h-4 w-4" />
			</Button>
		</motion.div>
	)
}

export default TaskBubble