'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Folder, Loader2 } from 'lucide-react'
import NotesList from './NotesList'
import NoteEditor from './NoteEditor'
import FolderList from './FolderList'
import { NewFolderModal } from './NewFolderModal'
import useNotesStore from '@/Stores/NotesStore'
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"

function NotesPage() {
	const {
		notes,
		folders,
		selectedNote,
		selectedFolder,
		searchTerm,
		isLoading,
		error,
		addNote,
		setSelectedNote,
		setSearchTerm,
		addFolder,
		deleteFolder,
		renameFolder,
		setSelectedFolder,
		getFilteredNotes,
		initialize,
		clearError
	} = useNotesStore()
	
	const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false)
	const { toast } = useToast()
	
	// Инициализация данных при монтировании
	useEffect(() => {
		initialize().catch(error => {
			toast({
				title: "Error",
				description: "Failed to load notes and folders",
				variant: "destructive",
			})
		})
	}, [initialize, toast])
	
	// Обработка ошибок
	useEffect(() => {
		if (error) {
			toast({
				title: "Error",
				description: error,
				variant: "destructive",
			})
			clearError()
		}
	}, [error, toast, clearError])
	
	const handleCreateFolder = async (folderName) => {
		try {
			await addFolder(folderName)
			setIsNewFolderModalOpen(false)
			toast({
				title: "Success",
				description: "Folder created successfully",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create folder",
				variant: "destructive",
			})
		}
	}
	
	const handleAddNote = async () => {
		try {
			const newNote = await addNote()
			if (newNote) {
				toast({
					title: "Success",
					description: "Note created successfully",
				})
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create note",
				variant: "destructive",
			})
		}
	}
	
	const handleDeleteFolder = async (folderId) => {
		try {
			await deleteFolder(folderId)
			toast({
				title: "Success",
				description: "Folder deleted successfully",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete folder",
				variant: "destructive",
			})
		}
	}
	
	const handleRenameFolder = async (folderId, newName) => {
		try {
			await renameFolder(folderId, newName)
			toast({
				title: "Success",
				description: "Folder renamed successfully",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to rename folder",
				variant: "destructive",
			})
		}
	}
	
	const filteredNotes = getFilteredNotes()
	
	// Отображение загрузки
	if (isLoading && !notes.length && !folders.length) {
		return (
			<Card className="flex h-[calc(100vh-5rem)] bg-background rounded-lg overflow-hidden items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">Loading notes...</p>
				</div>
			</Card>
		)
	}
	
	return (
		<Card className="flex h-[calc(100vh-5rem)] bg-background rounded-lg overflow-hidden">
			<div className="w-64 border-r bg-background p-4 rounded-l-lg">
				<Button
					className="w-full mb-4"
					onClick={() => setIsNewFolderModalOpen(true)}
				>
					<Folder className="mr-2 h-4 w-4" />
					New Folder
				</Button>
				<FolderList
					folders={folders}
					selectedFolder={selectedFolder}
					onSelectFolder={setSelectedFolder}
					onDeleteFolder={handleDeleteFolder}
					onRenameFolder={handleRenameFolder}
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
						<Button
							className="w-full"
							onClick={handleAddNote}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							) : (
								<Plus className="mr-2 h-4 w-4" />
							)}
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
			
			<NewFolderModal
				isOpen={isNewFolderModalOpen}
				onClose={() => setIsNewFolderModalOpen(false)}
				onCreateFolder={handleCreateFolder}
			/>
		</Card>
	)
}

export default NotesPage