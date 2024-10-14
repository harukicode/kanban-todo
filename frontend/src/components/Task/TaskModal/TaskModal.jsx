import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, MoveRight, Clock, FileText, MoreHorizontal, Trash } from 'lucide-react';
import { useTaskModal } from '@/hooks/taskHooks/modalTaskHooks/useTaskModal.jsx';
import { useSubtasks } from '@/hooks/taskHooks/modalTaskHooks/useSubtasks.jsx';
import { useTaskModalTimer } from '@/hooks/taskHooks/modalTaskHooks/useTaskModalTimer.jsx';
import SubtaskList from '@/components/Task/TaskModal/SubtaskList.jsx';
import TaskDescription from '@/components/Task/TaskModal/TaskDescription.jsx';
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx';

export default function TaskModal({ isOpen, onClose, task, onUpdate, onDelete, columnId }) {
	const { editedTask, setEditedTask, handleSave, handleClose } = useTaskModal(task, onUpdate, onClose);
	const { subtasks, completedSubtasks, newSubtask, setNewSubtask, handleSubtaskToggle, handleAddSubtask } = useSubtasks(editedTask, setEditedTask);
	const { isTimerOpen, setIsTimerOpen, timerPosition, timerVisible, dialogRef } = useTaskModalTimer(isOpen);
	
	// Удаление задачи
	const handleDeleteTask = () => {
		onDelete(columnId, task.id);  // Передаем columnId и task.id для удаления задачи
		handleClose();  // Закрываем модальное окно после удаления
	};
	
	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[700px] bg-white p-0 flex flex-col max-h-[90vh]" ref={dialogRef}>
					<div className="p-6 flex-grow overflow-y-auto">
						<DialogHeader className="mb-4">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 rounded-full bg-yellow-400"></div>
								{/* Возможность редактирования заголовка задачи */}
								<input
									className="text-2xl font-bold w-full bg-transparent border-b-2 border-gray-200 focus:outline-none"
									value={editedTask.title}
									onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
								/>
							</div>
						</DialogHeader>
						<div className="space-y-4">
							{/* Описание задачи */}
							<TaskDescription
								description={editedTask.description}
								timeSpent={editedTask.timeSpent}
								onChange={(newDescription) => setEditedTask({ ...editedTask, description: newDescription })}
							/>
							<Separator />
							{/* Subtask List */}
							<SubtaskList
								subtasks={subtasks}
								completedSubtasks={completedSubtasks}
								newSubtask={newSubtask}
								setNewSubtask={setNewSubtask}
								onSubtaskToggle={handleSubtaskToggle}
								onAddSubtask={handleAddSubtask}
							/>
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
								<Button
									variant="destructive"
									size="sm"
									onClick={handleDeleteTask}  // Вызываем handleDeleteTask для удаления
								>
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

TaskModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	task: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		timeSpent: PropTypes.number,
	}).isRequired,
	onUpdate: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
