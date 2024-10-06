import React from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { GrEdit } from 'react-icons/gr';
import { ChevronDown } from 'lucide-react';

const Header = ({ editMode, setEditMode, projects, activeProject, setActiveProject }) => {
	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-2">
				<h1 className="text-2xl font-bold">Kanban Board</h1>
				<Button color="primary" variant="light" onClick={() => setEditMode(!editMode)}>
					<GrEdit size={25} />
					{editMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
				</Button>
			</div>
			<Dropdown>
				<DropdownTrigger>
					<Button
						variant="bordered"
						endContent={<ChevronDown size={16} />}
					>
						{activeProject === 'all' ? 'All Projects' : activeProject}
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Project selection"
					onAction={(key) => setActiveProject(key)}
					selectedKeys={[activeProject]}
				>
					<DropdownItem key="all">All Projects</DropdownItem>
					{projects.map(project => (
						<DropdownItem key={project.name}>{project.name}</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
};

export default Header;