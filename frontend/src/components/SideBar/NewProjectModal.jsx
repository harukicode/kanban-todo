import  { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const colorOptions = [
	"#9333ea", "#eab308", "#3b82f6", "#6b7280",
	"#ef4444", "#10b981", "#f97316", "#8b5cf6"
];

const AddProjectModal = ({ isOpen, onClose, onAddProject }) => {
	const [projectName, setProjectName] = useState('');
	const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (projectName.trim()) {
			onAddProject({ name: projectName.trim(), color: selectedColor });
			setProjectName('');
			setSelectedColor(colorOptions[0]);
			onClose();
		}
	};
	
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Project</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="projectName" className="text-right">
								Name
							</Label>
							<Input
								autoComplete="off"
								id="projectName"
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Color</Label>
							<div className="flex gap-2 col-span-3">
								{colorOptions.map((color) => (
									<div
										key={color}
										className={`w-6 h-6 rounded-full cursor-pointer ${
											selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''
										}`}
										style={{ backgroundColor: color }}
										onClick={() => setSelectedColor(color)}
									/>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Add Project</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddProjectModal;