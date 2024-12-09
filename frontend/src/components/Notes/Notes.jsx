'use client'

import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Folder } from 'lucide-react'
import NotesList from './NotesList'
import NoteEditor from './NoteEditor'
import FolderList from './FolderList'
import useNotesStore from '@/Stores/NotesStore'

function NotesPage() {
	const {
		notes,
		folders,
		selectedNote,
		selectedFolder,
		searchTerm,
		addNote,
		setSelectedNote,
		setSearchTerm,
		addFolder,
		deleteFolder,
		renameFolder,
		setSelectedFolder,
		getFilteredNotes
	} = useNotesStore()
	
	const handleAddFolder = () => {
		const folderName = prompt('Enter new folder name:')
		if (folderName) {
			addFolder(folderName)
		}
	}
	
	const filteredNotes = getFilteredNotes()
	
	return (
		<Card className="flex h-[calc(100vh-5rem)] bg-background rounded-lg overflow-hidden">
			<div className="w-64 border-r bg-background p-4 rounded-l-lg">
				<Button className="w-full mb-4" onClick={handleAddFolder}>
					<Folder className="mr-2 h-4 w-4" />
					New Folder
				</Button>
				<FolderList
					folders={folders}
					selectedFolder={selectedFolder}
					onSelectFolder={setSelectedFolder}
					onDeleteFolder={deleteFolder}
					onRenameFolder={renameFolder}
				/>
			</div>
			<div className="flex flex-1">
				<div className="w-72 border-r bg-background">
					<div className="p-4 border-b">
						<Input
							placeholder="Search notes..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="mb-2"
						/>
						<Button className="w-full" onClick={addNote}>
							<Plus className="mr-2 h-4 w-4" />
							Add Note
						</Button>
					</div>
					<NotesList
						notes={filteredNotes}
						selectedNote={selectedNote}
						onSelectNote={setSelectedNote}
					/>
				</div>
				
				{selectedNote && (
					<NoteEditor
						noteId={selectedNote.id}
					/>
				)}
			</div>
		</Card>
	)
}

export default NotesPage