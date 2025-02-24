import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from '@/components/ui/sidebar.jsx'
import useProjectStore from "@/Stores/ProjectsStore.jsx";
import { IoIosTimer } from "react-icons/io";
import { ChevronDown, Plus, Focus } from "lucide-react";
import AddTimer from "@/components/AddTimer/AddTimer";
import React, { useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom";
export default function Header({
                                 onAddColumn,
                                 setPriorityFilter,
                                 priorityFilter,
                                 showAllSubtasks,
                                 toggleShowAllSubtasks,
                               }) {
  const { projects, activeProjectId, setActiveProjectId } = useProjectStore();
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const navigate = useNavigate();
  
  
  const activeProject = useMemo(() =>
      projects.find((project) => project.id === activeProjectId) || projects[0],
    [projects, activeProjectId]
  );
  
  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];
  
  const activePriority =
    priorities.find((p) => p.value === priorityFilter) || priorities[0];
  
  
  // Если нет проектов, отображаем упрощенный заголовок
  if (projects.length === 0) {
    return (
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
      </div>
    );
  }
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => navigate('/focus')}
          >
            <Focus size={20} />
            <span>Focus Mode</span>
          </Button>
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
      
      {isTimerVisible && (
        <div className="fixed top-24 right-20 z-50">
          <AddTimer />
        </div>
      )}
    </div>
  );
}