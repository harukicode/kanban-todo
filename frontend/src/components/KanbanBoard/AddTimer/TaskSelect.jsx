import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"

const TaskSelect = () => (
	<Select onValueChange={(value) => console.log(value)}>
		<SelectTrigger className="w-full">
			<SelectValue placeholder="Select Task" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="task1">Task 1</SelectItem>
			<SelectItem value="task2">Task 2</SelectItem>
			<SelectItem value="task3">Task 3</SelectItem>
		</SelectContent>
	</Select>
);

export default TaskSelect;