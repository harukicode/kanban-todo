import { useMemo } from "react";

export const usePriorityColor = (priority) => {
  return useMemo(() => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100";
      case "medium":
        return "bg-orange-100";
      case "low":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  }, [priority]);
};
