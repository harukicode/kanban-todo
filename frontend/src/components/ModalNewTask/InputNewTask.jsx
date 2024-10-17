import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputNewTask = ({ value, onChange }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
        <div className="w-full">
          <Label htmlFor="taskInput" className="text-sm font-medium">
            Task name
          </Label>
          <Input
            id="taskInput"
            placeholder="Enter task name"
            value={value}
            onChange={onChange}
            autoComplete="off"
            className="mt-3 mb-3"
          />
        </div>
      </div>
    </div>
  </div>
);

export default InputNewTask;
