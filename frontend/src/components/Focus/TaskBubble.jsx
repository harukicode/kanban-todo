import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const TaskBubble = ({ task, initialPosition, onRemove }) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{
				type: "spring",
				duration: 0.5,
				bounce: 0.3
			}}
			style={{
				position: 'absolute',
				left: initialPosition.x,
				top: initialPosition.y,
				transform: 'translate(-50%, -50%)',
				willChange: 'transform'
			}}
			className="group inline-flex items-center justify-center gap-1 rounded-full bg-white shadow-[0_4px_8px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_10px_-4px_rgba(0,0,0,0.15)] px-3 py-1.5 transition-all duration-200"
		>
      <span
	      className="text-sm font-medium text-gray-800 whitespace-nowrap"
	      title={task}
      >
        {task}
      </span>
			<Button
				variant="ghost"
				size="sm"
				className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-red-100 hover:text-red-600 ml-1 flex-shrink-0"
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
			>
				<X className="h-3 w-3" />
			</Button>
		</motion.div>
	);
};

export default TaskBubble;

