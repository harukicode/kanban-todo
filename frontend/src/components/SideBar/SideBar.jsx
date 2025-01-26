import { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigationItems } from "@/hooks/SideBar/useNavigationItems";
import AddProjectModal from "@/components/SideBar/SideBarModals/NewProjectModal";
import EditProjectModal from "@/components/SideBar/SideBarModals/EditProjectModal";
import useProjectStore from "@/Stores/ProjectsStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function SideBar() {
  const { navigationItems, currentPath } = useNavigationItems();
  const {
    projects,
    activeProjectId,
    addProject,
    setActiveProjectId,
    deleteProject,
    editProject,
    fetchProjects, // Добавляем новый метод
    isLoading,     // Добавляем индикатор загрузки
    error          // Добавляем обработку ошибок
  } = useProjectStore();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  
  const [modalState, setModalState] = useState({
    editModal: {
      isOpen: false,
      project: null
    },
    addModal: {
      isOpen: false
    }
  });
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleEditProject = useCallback((project) => {
    setModalState(prev => ({
      ...prev,
      editModal: {
        isOpen: true,
        project
      }
    }));
  }, []);
  
  
  const handleDeleteProject = useCallback((id) => {
    deleteProject(id);
  }, [deleteProject]);
  
  
  const handleCloseEditModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      editModal: {
        isOpen: false,
        project: null
      }
    }));
  }, []);
  
  
  
  return (
    <Sidebar className="w-64 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col">
      <SidebarHeader className="px-4 pb-1 pt-8 bg-gray-50">
        <div className="flex items-center mb-6">
          <Avatar className="mr-3">
            <AvatarImage src="https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg" />
          </Avatar>
          <div>
            <p className="font-semibold">Good Morning,</p>
            <p>Illia</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-0 flex-grow overflow-y-auto">
        <SidebarGroup>
          <h3 className="text-l font-bold mb-4 px-4">Navigation</h3>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === item.path}
                  className={`w-full h-12 justify-start rounded-lg flex items-center px-4 mb-2 transition-all${
                    currentPath === item.path ? "active-button" : "inactive-button"
                  }`}
                >
                  <Link to={item.path} className="flex items-center w-full gap-3">
                    <item.icon/>
                    <span className="text-lg" >{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4 bg-gray-200" />

        <SidebarGroup>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            My Projects
          </h3>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <div
                  className={`flex items-center justify-between p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-all ${
                    project.id === activeProjectId
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  }`}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <span
                      className={`text-base ${
                        project.id === activeProjectId ? "font-semibold" : ""
                      }`}
                    >
                      {project.name}
                    </span>
                  </div>
                  {project.id !== "all" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditProject(project)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-gray-200">
        <Button
          className="w-full mb-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2"
          onClick={() => setIsAddProjectModalOpen(true)}
        >
          <IoAddOutline size={18} className="mr-2" />
          New Project
        </Button>
        <Button
          className="w-full rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 text-sm py-2"
          variant="outline"
        >
          <MdOutlineSettingsSuggest size={18} className="mr-2" />
          Settings
        </Button>
      </SidebarFooter>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAddProject={addProject}
      />
      
      <EditProjectModal
        isOpen={modalState.editModal.isOpen}
        onClose={handleCloseEditModal}
        onEditProject={editProject}
        project={modalState.editModal.project}
      />
    </Sidebar>
  );
}
