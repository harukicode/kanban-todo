import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

export function NewFolderModal({ isOpen, onClose, onCreateFolder }) {
	const [folderName, setFolderName] = useState("");
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (folderName.trim()) {
			onCreateFolder(folderName.trim());
			setFolderName("");
			onClose();
		}
	};
	
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Folder</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<Input
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
							placeholder="Enter folder name"
							autoFocus
						/>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={!folderName.trim()}>
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}