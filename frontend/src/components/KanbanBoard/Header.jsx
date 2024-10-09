import React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IoIosTimer } from "react-icons/io";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import AddTimer from '@/components/KanbanBoard/AddTimer/AddTimer.jsx'
import { ChevronDown } from "lucide-react";

/**
 * Header component for the Kanban board.
 * Includes the title, edit mode toggle, and project selection dropdown.
 */
const Header = ({
	                addTimer,
	                setAddTimer,
	                projects,
	                activeProject,
	                setActiveProject,
                }) => (
	<div className="mb-4">
		<div className="flex justify-between items-center mb-2">
			<h1 className="text-2xl font-bold">Kanban Board</h1>
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
		</div>
		
		{/* Project Selection Dropdown */}
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="flat" className="w-[200px] justify-between">
					{activeProject === "all" ? "All Projects" : activeProject}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[200px]">
				<DropdownMenuItem onSelect={() => setActiveProject("all")}>
					All Projects
				</DropdownMenuItem>
				{projects.map((project) => (
					<DropdownMenuItem
						key={project.name}
						onSelect={() => setActiveProject(project.name)}
					>
						{project.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
);

export default Header;