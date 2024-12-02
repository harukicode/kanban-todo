'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Folder } from 'lucide-react'
import NotesList from './NotesList'
import NoteEditor from './NoteEditor'
import FolderList from './FolderList'

function NotesPage() {
	
	const [notes, setNotes] = useState(() => {
		const savedNotes = localStorage.getItem('notes')
		return savedNotes ? JSON.parse(savedNotes) : [
			{
				id: 1,
				title: 'Note 1',
				content: 'Content of note 1',
				tags: ['web-app', 'work'],
				isPinned: false,
				reminder: null,
				folderId: null,
				attachments: []
			}
		]
	})
	const [selectedNote, setSelectedNote] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [folders, setFolders] = useState(() => {
		const savedFolders = localStorage.getItem('folders')
		return savedFolders ? JSON.parse(savedFolders) : []
	})
	const [selectedFolder, setSelectedFolder] = useState(null)
	
	useEffect(() => {
		if (selectedNote) {
			const updatedNote = notes.find(note => note.id === selectedNote.id)
			if (updatedNote) {
				setSelectedNote(updatedNote)
			}
		}
	}, [notes])
	
	useEffect(() => {
		localStorage.setItem('folders', JSON.stringify(folders))
	}, [folders])
	
	const addNote = () => {
		const newNote = {
			id: Date.now(),
			title: 'New Note',
			content: '',
			tags: [],
			isPinned: false,
			reminder: null,
			folderId: selectedFolder,
			attachments: []
		}
		setNotes([...notes, newNote])
		setSelectedNote(newNote)
	}
	
	const updateNote = (updatedNote) => {
		setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
		setSelectedNote(updatedNote)
	}
	
	const deleteNote = (noteId) => {
		setNotes(notes.filter(note => note.id !== noteId))
		setSelectedNote(null)
	}
	
	const addFolder = () => {
		const folderName = prompt('Enter new folder name:')
		if (folderName) {
			const newFolder = {
				id: Date.now(),
				name: folderName
			}
			setFolders([...folders, newFolder])
		}
	}
	
	const deleteFolder = (folderId) => {
		setFolders(folders.filter(folder => folder.id !== folderId))
		setNotes(notes.map(note => note.folderId === folderId ? { ...note, folderId: null } : note))
		if (selectedFolder === folderId) {
			setSelectedFolder(null)
		}
	}
	
	const renameFolder = (folderId, newName) => {
		setFolders(folders.map(folder => folder.id === folderId ? { ...folder, name: newName } : folder))
	}
	
	const togglePinNote = (noteId) => {
		setNotes(notes.map(note =>
			note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
		))
	}
	
	const addTagToNote = (noteId, tag) => {
		setNotes(notes.map(note =>
			note.id === noteId ? { ...note, tags: [...note.tags, tag] } : note
		))
	}
	
	const removeTagFromNote = (noteId, tagToRemove) => {
		setNotes(notes.map(note =>
			note.id === noteId ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) } : note
		))
	}
	
	const duplicateNote = (noteId) => {
		const noteToDuplicate = notes.find(note => note.id === noteId)
		if (noteToDuplicate) {
			const duplicatedNote = {
				...noteToDuplicate,
				id: Date.now(),
				title: `${noteToDuplicate.title} (copy)`,
			}
			setNotes([...notes, duplicatedNote])
		}
	}
	
	const moveNoteToFolder = (noteId, folderId) => {
		setNotes(notes.map(note =>
			note.id === noteId ? { ...note, folderId: folderId } : note
		))
	}
	
	const attachFileToNote = (noteId, file) => {
		setNotes(notes.map(note =>
			note.id === noteId ? { ...note, attachments: [...note.attachments, file] } : note
		))
	}
	
	const filteredNotes = notes
		.filter(note =>
			(selectedFolder ? note.folderId === selectedFolder : true) &&
			(note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				note.content.toLowerCase().includes(searchTerm.toLowerCase()))
		)
		.sort((a, b) => {
			// Сначала сортируем по закрепленности
			if (a.isPinned && !b.isPinned) return -1;
			if (!a.isPinned && b.isPinned) return 1;
			
			// Если оба закреплены или оба не закреплены, сортируем по дате создания
			return b.id - a.id;
		})
	
	
	const addComment = (noteId, content) => {
		const newComment = {
			id: Date.now(),
			content,
			createdAt: new Date().toISOString(),
			author: 'Current User',
			authorInitial: 'C'
		}
		
		setNotes(notes.map(note =>
			note.id === noteId
				? {
					...note,
					comments: [...(note.comments || []), newComment]
				}
				: note
		))
	}
	
	const editComment = (noteId, commentId, newContent) => {
		const updatedNotes = notes.map(note =>
			note.id === noteId
				? {
					...note,
					comments: (note.comments || []).map(comment =>
						comment.id === commentId
							? { ...comment, content: newContent }
							: comment
					)
				}
				: note
		);
		setNotes(updatedNotes);
	}
	
	const deleteComment = (noteId, commentId) => {
		const updatedNotes = notes.map(note =>
			note.id === noteId
				? { ...note, comments: (note.comments || []).filter(comment => comment.id !== commentId) }
				: note
		);
		setNotes(updatedNotes);
	}
	
	return (
		<Card className="flex h-[calc(100vh-5rem)] bg-background rounded-lg overflow-hidden">
			<div className="w-64 border-r bg-background p-4 rounded-l-lg">
				<Button className="w-full mb-4" onClick={addFolder}>
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
				
				<NoteEditor
					note={selectedNote}
					onUpdateNote={updateNote}
					onDeleteNote={deleteNote}
					onTogglePin={togglePinNote}
					onAddTag={addTagToNote}
					onRemoveTag={removeTagFromNote}
					onDuplicateNote={duplicateNote}
					onMoveToFolder={moveNoteToFolder}
					onAttachFile={attachFileToNote}
					folders={folders}
				/>
			</div>
		</Card>
	)
}

export default NotesPage