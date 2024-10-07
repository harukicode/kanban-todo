import { Input } from "@nextui-org/react"; // Importing Input component from NextUI

// InputNewTask is a functional component for task input field
export default function InputNewTask({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      {" "}
      {/* Flexbox container with vertical spacing */}
      <div className="flex flex-col gap-2">
        {" "}
        {/* Nested flex container with vertical spacing */}
        <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
          {" "}
          {/* Responsive flex container */}
          <Input
            label="Type your task" // Input field label
            labelPlacement="outside" // Label is placed outside the input
            placeholder="Enter task name" // Placeholder text for the input
            description="outside" // The description is placed outside
            value={value} // The input's value is controlled via the value prop
            onChange={onChange} // The input's onChange handler to update the value
          />
        </div>
      </div>
    </div>
  );
}
