import { create } from "zustand";

const useProjectStore = create((set) => ({
  projects: [
    { id: "default_project", name: "Default Project", color: "#6b7280" }, // дефолтный проект, который создается при первом запуске
  ],
  activeProjectId: "default_project", // передаю id дефолтного проекта как активный

  //////////////// функции для работы с проектами

  // добавление нового проекта
  addProject: (newProject) =>
    set((state) => ({
      projects: [
        ...state.projects,
        { ...newProject, id: Date.now().toString() },
      ], // добавляю новый проект в массив проектов
    })),

  setActiveProjectId: (id) => set({ activeProjectId: id }), // устанавливаю активный проект по id

  // удаление проекта
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id), // удаляю проект по id
      activeProjectId:
        state.activeProjectId === id
          ? "default_project"
          : state.activeProjectId, // если удаляю активный проект, то устанавливаю дефолтный проект
    })),

  // изменение проекта
  editProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      ), // изменяю проект по id
    })),
}));

export default useProjectStore;
