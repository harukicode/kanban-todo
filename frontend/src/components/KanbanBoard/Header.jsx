import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useProjectStore from '@/Stores/ProjectsStore.jsx'
import { IoIosTimer } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx'
import { ChevronDown, Plus } from "lucide-react";

const Header = ({ addTimer, setAddTimer, priorityFilter, setPriorityFilter, onAddColumn }) => {
	const { projects, activeProjectId, addProject, setActiveProjectId } = useProjectStore();
	const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
	
	const priorities = [
		{ value: "all", label: "All Priorities" },
		{ value: "high", label: "High" },
		{ value: "secondary", label: "Secondary" },
		{ value: "low", label: "Low" },
	];
	
	const activePriority = priorities.find(p => p.value === priorityFilter) || priorities[0];
	
	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-2">
				<h1 className="text-2xl font-bold">Kanban Board</h1>
				<div className="flex space-x-2">
					<Popover open={addTimer} onOpenChange={setAddTimer}>
						<PopoverTrigger asChild>
							<Button variant="outline" className="flex items-center space-x-2">
								<IoIosTimer size={20} />
							</Button>
						</PopoverTrigger>
						<PopoverContent side="left" className="mr-16 bg-transparent shadow-none border-none">
							<AddTimer />
						</PopoverContent>
					</Popover>
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
			</div>
		</div>
	);
};

export default Header;