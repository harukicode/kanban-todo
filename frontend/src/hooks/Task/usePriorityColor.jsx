import { useMemo } from "react";

export const usePriorityColor = (priority) => {
  return useMemo(() => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100";
      case "secondary":
        return "bg-blue-100";
      case "low":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  }, [priority]);
};
