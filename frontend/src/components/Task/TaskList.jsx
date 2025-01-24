import Task from "@/components/Task/Task.jsx";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const TasksList = ({ tasks, columnId, showSubtasks, doneColumn }) => {
  
  
  
  const uniqueTasks = tasks.reduce((acc, task) => {
    if (!acc.some(t => t.id === task.id)) {
      acc.push(task);
    }
    return acc;
  }, []);
  
  
  return (
    <div className="space-y-2 flex-grow">
      <SortableContext
        items={uniqueTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {uniqueTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            columnId={columnId}
            showSubtasks={showSubtasks}
            doneColumn={doneColumn}
          />
        ))}
      </SortableContext>
    </div>
  );
};