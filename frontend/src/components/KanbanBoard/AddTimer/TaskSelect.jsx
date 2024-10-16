import React from 'react';
import { Button } from "@/components/ui/button";
import { Target } from 'lucide-react';
import {useTimer} from '@/components/KanbanBoard/AddTimer/TimerContext.jsx'

const TaskSelect = ({ onStartSelection }) => {
	const { setIsSelectingTaskForTimer } = useTimer();
	
	const handleStartSelection = () => {
		if (typeof setIsSelectingTaskForTimer === 'function') {
			setIsSelectingTaskForTimer(true);
		} else {
			console.error('setIsSelectingTaskForTimer is not a function');
		}
		if (onStartSelection) {
			onStartSelection();
		}
	};
	
	return (
		<Button
			onClick={handleStartSelection}
			variant="outline"
			className="w-full flex items-center justify-center gap-2 mt-4"
		>
			<Target className="w-4 h-4" />
			<span>Select Task</span>
		</Button>
	);
};

export default TaskSelect;