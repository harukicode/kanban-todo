import { useLocation } from "react-router-dom";
import { CiViewBoard } from "react-icons/ci";
import { RxLapTimer } from "react-icons/rx";
import { SlNote } from "react-icons/sl";

export const useNavigationItems = () => {
  const location = useLocation();

  const navigationItems = [
    { icon: CiViewBoard, label: "Kanban Board", path: "/kanban" },
    { icon: RxLapTimer, label: "Timer", path: "/timer" },
    { icon: SlNote, label: "Notes", path: "/notes" },
  ];

  return { navigationItems, currentPath: location.pathname };
};
