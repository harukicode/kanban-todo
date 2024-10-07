import React from "react";
import { Input } from "@nextui-org/react";


/**
 * InputNewTask component provides an input field for the task title.
 */
const InputNewTask = ({ value, onChange }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          label="Type your task"
          labelPlacement="outside"
          placeholder="Enter task name"
          description="Task title"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  </div>
);



export default InputNewTask;
