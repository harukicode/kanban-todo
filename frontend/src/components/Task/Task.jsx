import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx"; // Ensure the path is correct
import { Tooltip, Button } from "@nextui-org/react";


/**
 * Task component displays an individual task within a column.
 * It shows the task's priority, title, and description.
 */
const Task = ({ task }) => {
  // Mapping task priorities to specific button color classes
  const colorMapping = {
    None: "default",      // Default color for 'None' priority
    Low: "warning",       // Yellowish warning color for 'Low' priority
    Secondary: "primary", // Blue primary color for 'Secondary' priority
    High: "danger",       // Red danger color for 'High' priority
  };
  
  return (
    <Card className="mb-4" style={{ backgroundColor: "#e1f4fa" }}>
      {/* Task card with light blue background */}
      <CardHeader>
        <div className="flex items-center justify-start mb-2">
          {/* Tooltip displaying the priority label */}
          <Tooltip
            color={colorMapping[task.priority]}
            content={task.priority}
            className="capitalize"
          >
            <Button
              variant="flat" // Flat variant for the button
              color={colorMapping[task.priority]} // Button color based on task priority
              className="capitalize text-xs px-1 py-0 min-w-14 h-7" // Small button with capitalized text
            >
              {task.priority} {/* Display the task priority inside the button */}
            </Button>
          </Tooltip>
        </div>
        
        {/* Task title */}
        <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
        
        {/* Task description */}
        <CardDescription className="text-sm">
          {task.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};



export default Task;