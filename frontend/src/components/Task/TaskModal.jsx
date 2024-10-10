import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MoveRight, Clock, FileText, MoreHorizontal, Trash } from 'lucide-react';
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx'

export default function TaskModal({ isOpen, onClose, task, onUpdate, onDelete }) {
	const [editedTask, setEditedTask] = useState({
		...task,
		subtasks: task.subtasks || []
	});
	const [newSubtask, setNewSubtask] = useState('');
	const [isTimerOpen, setIsTimerOpen] = useState(false);
	const dialogRef = useRef(null);
	const [timerPosition, setTimerPosition] = useState({ top: 0, left: 0 });
	const [timerVisible, setTimerVisible] = useState(false);
	
	const completedSubtasks = editedTask.subtasks.filter(subtask => subtask.completed).length;
	
	useEffect(() => {
		if (isTimerOpen && dialogRef.current) {
			const rect = dialogRef.current.getBoundingClientRect();
			setTimerPosition({
				top: rect.top,
				left: rect.right + 20, // 20px gap between modal and timer
			});
			setTimeout(() => setTimerVisible(true), 50);
		} else {
			setTimerVisible(false);
		}
	}, [isTimerOpen]);
	
	useEffect(() => {
		if (!isOpen) {
			setIsTimerOpen(false);
		}
	}, [isOpen]);
	
	const handleSubtaskToggle = (index) => {
		const updatedSubtasks = [...editedTask.subtasks];
		updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
		setEditedTask({ ...editedTask, subtasks: updatedSubtasks });
	};
	
	const handleAddSubtask = () => {
		if (newSubtask.trim()) {
			setEditedTask({
				...editedTask,
				subtasks: [...editedTask.subtasks, { title: newSubtask, completed: false }]
			});
			setNewSubtask('');
		}
	};
	
	const handleSave = () => {
		onUpdate(editedTask);
		onClose();
	};
	
	const handleClose = () => {
		setIsTimerOpen(false);
		onClose();
	};
	
	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[700px] bg-white p-0 flex flex-col max-h-[90vh]" ref={dialogRef}>
					<div className="p-6 flex-grow overflow-y-auto">
						<DialogHeader className="mb-4">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 rounded-full bg-yellow-400"></div>
								<DialogTitle className="text-2xl font-bold">{editedTask.title}</DialogTitle>
							</div>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-semibold mb-2">Description</h3>
								<div className="bg-gray-50 rounded-md p-3">
									<p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{editedTask.description}</p>
								</div>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Time spent: {editedTask.timeSpent || '0m'}</p>
							</div>
							<Separator />
							<div>
								<h3 className="text-lg font-semibold mb-2">Subtasks {completedSubtasks}/{editedTask.subtasks.length}</h3>
								<ScrollArea className="h-[200px] w-full rounded-md border p-4">
									<div className="space-y-4">
										{editedTask.subtasks.map((subtask, index) => (
											<div key={index} className="flex items-center space-x-2">
												<Checkbox
													id={`subtask-${index}`}
													checked={subtask.completed}
													onCheckedChange={() => handleSubtaskToggle(index)}
												/>
												<label
													htmlFor={`subtask-${index}`}
													className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
														subtask.completed ? 'line-through text-muted-foreground' : ''
													}`}
												>
													{subtask.title}
												</label>
											</div>
										))}
									</div>
								</ScrollArea>
								<div className="flex items-center space-x-2 mt-4">
									<Input
										value={newSubtask}
										onChange={(e) => setNewSubtask(e.target.value)}
										placeholder="Add new subtask..."
										className="flex-grow"
									/>
									<Button onClick={handleAddSubtask} size="sm">Add</Button>
								</div>
							</div>
						</div>
					</div>
					<DialogFooter className="px-6 py-4 bg-gray-50 mt-auto">
						<div className="flex flex-wrap gap-2 justify-between w-full">
							<div className="flex flex-wrap gap-2">
								<Button variant="outline" size="sm"><Plus size={16} className="mr-2" /> Add</Button>
								<Button variant="outline" size="sm"><MoveRight size={16} className="mr-2" /> Move</Button>
								<Button variant="outline" size="sm" onClick={() => setIsTimerOpen(!isTimerOpen)}>
									<Clock size={16} className="mr-2" /> Timer
								</Button>
								<Button variant="outline" size="sm"><FileText size={16} className="mr-2" /> Reports</Button>
								<Button variant="outline" size="sm"><MoreHorizontal size={16} className="mr-2" /> More</Button>
							</div>
							<div className="flex gap-2">
								<Button variant="destructive" size="sm" onClick={() => { onDelete(editedTask.id); handleClose(); }}>
									<Trash size={16} className="mr-2" /> Delete
								</Button>
								<Button size="sm" onClick={handleSave}>Save Changes</Button>
							</div>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{isTimerOpen && createPortal(
				<div
					style={{
						position: 'fixed',
						top: `${timerPosition.top}px`,
						left: `${timerPosition.left}px`,
						zIndex: 1000,
						backgroundColor: 'transparent',
						padding: '1rem',
						transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
						opacity: timerVisible ? 1 : 0,
						transform: timerVisible ? 'translateX(0)' : 'translateX(-20px)',
					}}
				>
					<AddTimer />
				</div>,
				document.body
			)}
		</>
	);
}