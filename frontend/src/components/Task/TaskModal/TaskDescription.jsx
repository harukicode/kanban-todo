import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TaskDescription({ description, timeSpent, isEditing, onSave, onCancel }) {
	const [editedDescription, setEditedDescription] = useState(description);
	
	const handleSave = () => {
		onSave(editedDescription);
	};
	
	if (isEditing) {
		return (
			<div>
				<h3 className="text-sm font-semibold mb-2">Description</h3>
				<Textarea
					value={editedDescription}
					onChange={(e) => setEditedDescription(e.target.value)}
					className="w-full mb-2"
					rows={4}
				/>
				<div className="flex justify-end space-x-2">
					<Button variant="outline" size="sm" onClick={onCancel}>
						Cancel
					</Button>
					<Button size="sm" onClick={handleSave}>
						Save
					</Button>
				</div>
			</div>
		);
	}
	
	return (
		<>
			<div>
				<h3 className="text-sm font-semibold mb-2">Description</h3>
				<div className="bg-gray-50 rounded-md p-3">
					<p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{description}</p>
				</div>
			</div>
			<div>
				<p className="text-sm text-muted-foreground">Time spent: {timeSpent || '0m'}</p>
			</div>
		</>
	);
}