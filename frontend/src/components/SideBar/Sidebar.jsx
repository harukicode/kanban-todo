import { useState } from "react";
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

export default function SideBar() {
  const { navigationItems, currentPath } = useNavigationItems();
  const {
    projects,
    activeProjectId,
    addProject,
    setActiveProjectId,
    deleteProject,
    editProject,
  } = useProjectStore();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setIsEditProjectModalOpen(true);
  };

  const handleDeleteProject = (id) => {
    deleteProject(id);
  };

  return (
    <aside className="w-64 h-screen bg-zinc-100 border-spacing-1.5 shadow-xl backdrop-blur-md rounded-r-3xl flex flex-col">
      <div className="flex flex-col h-full">
        {/* Блок с прокруткой содержимого панели */}
        <div className="flex-grow overflow-y-auto">
          <div className="px-4 py-6">
            {/* Верхняя часть панели: аватар и приветствие */}
            <div className="flex items-center mb-6">
              <Avatar className="mr-3">
                <AvatarImage src="https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg" />
              </Avatar>
              <div>
                <p className="font-semibold">Good Morning,</p>
                <p>Illia</p>
              </div>
            </div>

            {/* Навигационное меню */}
            <nav>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 mb-6">
                {/* Проходим по каждому навигационному пункту и создаём ссылку */}
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path} // Путь для ссылки
                      className={`w-full justify-start rounded-xl text-black flex items-center p-2 ${
                        currentPath === item.path
                          ? "bg-primary text-primary-foreground text-white" // Стиль для активного пункта
                          : "bg-transparent hover:bg-accent hover:text-accent-foreground" // Стиль для неактивных пунктов
                      }`}
                    >
                      {/* Иконка пункта навигации */}
                      <item.icon size={22} className="mr-2" />
                      {/* Название пункта навигации */}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* разделитель между секциями */}
            <Separator className="my-4" />

            {/* Секция с проектами пользователя */}

            <div className="w-full rounded-lg">
              <h3 className="text-lg font-semibold mb-4">MY PROJECTS</h3>
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <div
                      className={`flex items-center justify-between p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer ${
                        project.id === activeProjectId
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                      onClick={() => setActiveProjectId(project.id)}
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
                          className={
                            project.id === activeProjectId
                              ? "font-semibold"
                              : ""
                          }
                        >
                          {project.name}
                        </span>
                      </div>
                      {project.id !== "all" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <Button
            className="w-full mb-2 rounded-xl"
            variant="default"
            onClick={() => setIsAddProjectModalOpen(true)}
          >
            <IoAddOutline size={22} className="mr-2" />
            New Project
          </Button>
          <Button className="w-full rounded-xl" variant="outline">
            <MdOutlineSettingsSuggest size={22} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAddProject={addProject}
      />

      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        onEditProject={editProject}
        project={projectToEdit}
      />
    </aside>
  );
}
