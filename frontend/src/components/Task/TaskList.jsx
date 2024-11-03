import Task from "@/components/Task/Task.jsx";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const TasksList = ({ tasks, columnId, showSubtasks, doneColumn }) => {
  return (
    <div className="space-y-2 flex-grow">
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
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
