import { Input } from "@nextui-org/react";

export default function InputNewTask({ value, onChange }) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
					<Input
						label="Type your task"
						labelPlacement="outside"
						placeholder="Enter task name"
						description="outside"
						value={value}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
}