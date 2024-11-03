import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useProjectStore from "@/Stores/ProjectsStore.jsx";
import { IoIosTimer } from "react-icons/io";
import { ChevronDown, Plus } from "lucide-react";
import AddTimer from "@/components/AddTimer/AddTimer";
import { useState } from "react";

export default function Header({
                                 onAddColumn,
                                 setPriorityFilter,
                                 priorityFilter,
                                 showAllSubtasks,
                                 toggleShowAllSubtasks,
                               }) {
  const { projects, activeProjectId, setActiveProjectId } = useProjectStore();
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  
  const activeProject =
    projects.find((project) => project.id === activeProjectId) || projects[0];
  
  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "secondary", label: "Secondary" },
    { value: "low", label: "Low" },
  ];
  const activePriority =
    priorities.find((p) => p.value === priorityFilter) || priorities[0];
  
  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <div className="flex space-x-2">
            <Button
              variant={isTimerVisible ? "default" : "outline"}
              className="flex items-center space-x-2"
              onClick={() => setIsTimerVisible(!isTimerVisible)}
            >
              <IoIosTimer size={20} />
            </Button>
            <Button variant="outline" onClick={onAddColumn}>
              <Plus size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="flat" className="w-[200px] justify-between">
                {activeProject.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onSelect={() => setActiveProjectId(project.id)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="flat" className="w-[200px] justify-between">
                {activePriority.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {priorities.map((priority) => (
                <DropdownMenuItem
                  key={priority.value}
                  onSelect={() => setPriorityFilter(priority.value)}
                >
                  {priority.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" onClick={toggleShowAllSubtasks}>
            {showAllSubtasks ? "Hide all subtasks" : "Show all subtasks"}
          </Button>
        </div>
      </div>
      {isTimerVisible && (
        <div className="fixed top-24 right-20 z-50">
          <AddTimer />
        </div>
      )}
    </>
  );
}