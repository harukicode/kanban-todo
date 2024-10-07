import React, { useState } from "react"; // Importing React and the useState hook for state management
import { CiViewBoard } from "react-icons/ci"; // Importing icons from the react-icons library
import { RxLapTimer } from "react-icons/rx";
import { SlNote } from "react-icons/sl";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { MoreVertical } from "lucide-react"; // Importing vertical ellipsis icon from lucide-react for dropdowns
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"; // Importing Dropdown components
import { Button, Divider, Avatar } from "@nextui-org/react"; // Importing Button, Divider, and Avatar components

// Navigation items array containing icon, label, and the component to be rendered when selected
const navigationItems = [
  { icon: CiViewBoard, label: "Kanban Board", component: "Kanban" },
  { icon: RxLapTimer, label: "Timer", component: "Timer" },
  { icon: SlNote, label: "Notes" },
];

// Projects array containing project names and their corresponding colors
const projects = [
  { name: "Mobile App", color: "#9333ea" },
  { name: "Website Redesign", color: "#eab308" },
  { name: "Design System", color: "#3b82f6" },
  { name: "Wireframes", color: "#6b7280" },
];

// Sidebar component that accepts a setActiveComponent prop for changing the active view
const Sidebar = ({ setActiveComponent }) => {
  // State to track the currently active navigation item
  const [activeItem, setActiveItem] = useState("Kanban Board");
  // State to track the currently active project
  const [activeProject, setActiveProject] = useState(null);

  return (
    // Sidebar container with some styles for width, height, and background transparency
    <aside className="w-64 h-screen bg-white/30 backdrop-blur-md rounded-r-3xl flex flex-col overflow-hidden">
      <div className="flex-grow px-4 py-6 overflow-hidden">
        {/* User profile section with an avatar and greeting */}
        <div className="flex items-center mb-6">
          <Avatar
            src="https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg"
            className="mr-3"
          />
          <div>
            <p className="font-semibold">Good Morning,</p> {/* Greeting text */}
            <p>Illia</p> {/* Hardcoded user name */}
          </div>
        </div>
        {/* Navigation section */}
        <nav>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>{" "}
          {/* Section title */}
          <ul className="space-y-2 mb-6">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Button
                  className="w-full justify-start rounded-xl" // Styling for button alignment and rounded corners
                  color={activeItem === item.label ? "primary" : "default"} // Highlight button if active
                  variant={activeItem === item.label ? "solid" : "ghost"} // Solid variant if active, otherwise ghost (transparent)
                  startContent={<item.icon size={22} />} // Icon rendering for each item
                  onPress={() => {
                    setActiveItem(item.label); // Set the active navigation item
                    if (item.component) setActiveComponent(item.component); // Change the active component
                  }}
                >
                  {item.label} {/* Label of the navigation item */}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <Divider className="my-4" /> {/* Divider line to separate sections */}
        {/* Projects section */}
        <div className="w-64 p-4 rounded-lg flex-grow overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">MY PROJECTS</h3>{" "}
          {/* Section title */}
          <ul className="space-y-2">
            {projects.map((project, index) => (
              <li key={index}>
                <div
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => setActiveProject(project.name)} // Set active project when clicked
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%", // Small circular indicator for project color
                        backgroundColor: project.color,
                      }}
                    ></div>
                    {/* Highlight the project name if it's the active one */}
                    <span
                      className={`${
                        activeProject === project.name ? "font-semibold" : ""
                      }`}
                    >
                      {project.name} {/* Name of the project */}
                    </span>
                  </div>
                  {/* Dropdown for project actions like edit or delete */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <MoreVertical size={16} />{" "}
                        {/* Vertical ellipsis icon */}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem>Edit</DropdownItem> {/* Edit option */}
                      <DropdownItem>Delete</DropdownItem> {/* Delete option */}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer section with buttons for creating a new project or accessing settings */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <Button
          className="w-full mb-2 rounded-xl"
          color="primary"
          startContent={<IoAddOutline size={22} />} // Icon for adding a new project
        >
          New Project
        </Button>
        <Button
          className="w-full rounded-xl"
          variant="ghost"
          startContent={<MdOutlineSettingsSuggest size={22} />} // Icon for settings
        >
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
