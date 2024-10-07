import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, Button } from "@nextui-org/react";

export default function Task({ task }) {
  // Mapping task priorities to specific button color classes
  const colorMapping = {
    None: "default", // Default color for 'None' priority
    Low: "warning", // Yellowish warning color for 'Low' priority
    Secondary: "primary", // Blue primary color for 'Secondary' priority
    Hight: "danger", // Red danger color for 'Hight' priority (Note: typo in 'Hight', should be 'High')
  };

  return (
    <Card className={"mb-8"} style={{ backgroundColor: "#e1f4fa" }}>
      {" "}
      {/* Card background color is set to light blue */}
      <CardHeader>
        <div className="flex items-center justify-start mb-2">
          {" "}
          {/* Flexbox to align the content inside the card header */}
          {/* Tooltip to display priority label */}
          <Tooltip
            color={colorMapping[task.priority]}
            content={task.priority}
            className="capitalize"
          >
            <Button
              variant="flat" // Flat variant for the button
              color={colorMapping[task.priority]} // Button color changes based on task priority
              className="capitalize text-xs px-1 py-0 min-w-14 h-7" // Small button with capitalized text
            >
              {task.priority}{" "}
              {/* Display the task priority inside the button */}
            </Button>
          </Tooltip>
        </div>
        <CardTitle className="text-lg font-bold">{task.title}</CardTitle>{" "}
        {/* Title of the task */}
        <CardDescription className="text-sm">
          {task.description}
        </CardDescription>{" "}
        {/* Short description of the task */}
      </CardHeader>
    </Card>
  );
}
