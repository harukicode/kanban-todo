import React, { useState } from 'react';
import { CiViewBoard } from "react-icons/ci";
import { RxLapTimer } from "react-icons/rx";
import { SlNote } from "react-icons/sl";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { MoreVertical } from 'lucide-react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Button, Divider, Avatar } from '@nextui-org/react';

const navigationItems = [
  { icon: CiViewBoard, label: 'Kanban Board', component: 'Kanban' },
  { icon: RxLapTimer, label: 'Timer', component: 'Timer' },
  { icon: SlNote, label: 'Notes' },
];

const projects = [
  { name: "Mobile App", color: "#9333ea" },
  { name: "Website Redesign", color: "#eab308" },
  { name: "Design System", color: "#3b82f6" },
  { name: "Wireframes", color: "#6b7280" }
];

const Sidebar = ({ setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState('Kanban Board');
  const [activeProject, setActiveProject] = useState(null);
  
  return (
    <aside className="w-64 h-screen bg-white/30 backdrop-blur-md rounded-r-3xl flex flex-col overflow-hidden">
      <div className="flex-grow px-4 py-6 overflow-hidden">
        <div className="flex items-center mb-6">
          <Avatar
            src="https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg"
            className="mr-3" />
          <div>
            <p className="font-semibold">Good Morning,</p>
            <p>Illia</p>
          </div>
        </div>
        
        <nav>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 mb-6">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Button
                  className="w-full justify-start rounded-xl"
                  color={activeItem === item.label ? "primary" : "default"}
                  variant={activeItem === item.label ? "solid" : "ghost"}
                  startContent={<item.icon size={22} />}
                  onPress={() => {
                    setActiveItem(item.label);
                    if (item.component) setActiveComponent(item.component);
                  }} // Переключаем компонент по клику
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <Divider className="my-4" />
        
        <div className="w-64 p-4 rounded-lg flex-grow overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">MY PROJECTS</h3>
          <ul className="space-y-2">
            {projects.map((project, index) => (
              <li key={index}>
                <div
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => setActiveProject(project.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: project.color
                      }}
                    ></div>
                    <span className={`${activeProject === project.name ? 'font-semibold' : ''}`}>
                      {project.name}
                    </span>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <Button
          className="w-full mb-2 rounded-xl"
          color="primary"
          startContent={<IoAddOutline size={22} />}
        >
          New Project
        </Button>
        <Button
          className="w-full rounded-xl"
          variant="ghost"
          startContent={<MdOutlineSettingsSuggest size={22} />}
        >
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
