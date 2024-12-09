import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import useNotesStore from '@/Stores/NotesStore.jsx'

function FolderList() {
	const [editingFolderId, setEditingFolderId] = useState(null)
	const [editingFolderName, setEditingFolderName] = useState('')
	
	const folders = useNotesStore(state => state.folders)
	const selectedFolder = useNotesStore(state => state.selectedFolder)
	const setSelectedFolder = useNotesStore(state => state.setSelectedFolder)
	const deleteFolder = useNotesStore(state => state.deleteFolder)
	const renameFolder = useNotesStore(state => state.renameFolder)
	
	const handleRename = (folderId) => {
		if (editingFolderName.trim()) {
			renameFolder(folderId, editingFolderName.trim())
			setEditingFolderId(null)
			setEditingFolderName('')
		}
	}
	
	return (
		<ScrollArea className="h-[calc(100vh-5rem)]">
			<Button
				variant={selectedFolder === null ? "secondary" : "ghost"}
				className="w-full justify-start mb-1"
				onClick={() => setSelectedFolder(null)}
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
								autoFocus
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
								onClick={() => setSelectedFolder(folder.id)}
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
								onClick={() => deleteFolder(folder.id)}
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