import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"

function FolderList({ folders, selectedFolder, onSelectFolder, onDeleteFolder, onRenameFolder }) {
	const [editingFolderId, setEditingFolderId] = useState(null)
	const [editingFolderName, setEditingFolderName] = useState('')
	
	const handleRename = (folderId) => {
		if (editingFolderName.trim()) {
			onRenameFolder(folderId, editingFolderName.trim())
			setEditingFolderId(null)
			setEditingFolderName('')
		}
	}
	
	return (
		<ScrollArea className="h-[calc(100vh-5rem)]">
			<Button
				variant={selectedFolder === null ? "secondary" : "ghost"}
				className="w-full justify-start mb-1"
				onClick={() => onSelectFolder(null)}
			>
				<Folder className="mr-2 h-4 w-4" />
				All Notes
			</Button>
			{folders.map(folder => (
				<div key={folder.id} className="flex items-center mb-1">
					{editingFolderId === folder.id ? (
						<div className="flex w-full">
							<Input
								value={editingFolderName}
								onChange={(e) => setEditingFolderName(e.target.value)}
								onBlur={() => handleRename(folder.id)}
								onKeyPress={(e) => e.key === 'Enter' && handleRename(folder.id)}
								className="mr-1"
							/>
							<Button size="icon" onClick={() => handleRename(folder.id)}>
								<Edit className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<>
							<Button
								variant={selectedFolder === folder.id ? "secondary" : "ghost"}
								className="w-full justify-start mr-1"
								onClick={() => onSelectFolder(folder.id)}
							>
								<Folder className="mr-2 h-4 w-4" />
								{folder.name}
							</Button>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => {
									setEditingFolderId(folder.id)
									setEditingFolderName(folder.name)
								}}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => onDeleteFolder(folder.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</>
					)}
				</div>
			))}
		</ScrollArea>
	)
}

export default FolderList

