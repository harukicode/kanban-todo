import React from "react";
import { Link } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigationItems } from '@/hooks/useNavigationItems.jsx'
import { useProjects} from '@/hooks/useProjects.jsx'

const Sidebar = () => {
  const { navigationItems, currentPath } = useNavigationItems();
  const { projects, activeProject, setActiveProject } = useProjects();
  
  return (
    <aside className="w-64 h-screen bg-zinc-100 border-spacing-1.5 shadow-xl backdrop-blur-md rounded-r-3xl flex flex-col overflow-hidden">
      <div className="flex-grow px-4 py-6 overflow-hidden">
        <div className="flex items-center mb-6">
          <Avatar className="mr-3">
            <AvatarImage src="https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg" />
            <AvatarFallback>IL</AvatarFallback>
          </Avatar>
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
                <Link
                  to={item.path}
                  className={`w-full justify-start rounded-xl text-black flex items-center p-2 ${
                    currentPath === item.path
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon size={22} className="mr-2" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <Separator className="my-4" />
        
        <div className="w-64 p-4 rounded-lg flex-grow overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">MY PROJECTS</h3>
          <ul className="space-y-2">
            {projects.map((project, index) => (
              <li key={index}>
                <div
                  className="flex items-center justify-between p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                  onClick={() => setActiveProject(project.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: project.color,
                      }}
                    ></div>
                    <span
                      className={`${
                        activeProject === project.name ? "font-semibold" : ""
                      }`}
                    >
                      {project.name}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <Button
          className="w-full mb-2 rounded-xl"
          variant="default"
        >
          <IoAddOutline size={22} className="mr-2" />
          New Project
        </Button>
        <Button
          className="w-full rounded-xl"
          variant="outline"
        >
          <MdOutlineSettingsSuggest size={22} className="mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;