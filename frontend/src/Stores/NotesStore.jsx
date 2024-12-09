import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

const initialFormatting = {
	bold: false,
	italic: false,
	underline: false,
	strike: false,
	align: 'left',
	size: 'normal',
	color: '#000000'
}

const initialState = {
	notes: [],
	folders: [],
	selectedNote: null,
	selectedFolder: null,
	searchTerm: '',
	isLoading: false,
	error: null
}

const useNotesStore = create(
	devtools(
		persist(
			(set, get) => ({
				...initialState,
				
				// Notes actions
				setNotes: (notes) => set({ notes }),
				setSelectedNote: (note) => set({ selectedNote: note }),
				
				addNote: () => {
					const newNote = {
						id: Date.now(),
						title: 'New Note',
						content: '',
						tags: [],
						isPinned: false,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						folderId: get().selectedFolder,
						formatting: { ...initialFormatting },
						attachments: [],
						comments: []
					}
					set(state => ({
						notes: [...state.notes, newNote],
						selectedNote: newNote
					}))
					return newNote
				},
				
				updateNote: (updatedNote) => {
					if (!updatedNote) return;
					
					const newNote = {
						...updatedNote,
						updatedAt: new Date().toISOString()
					};
					
					set(state => {
						const updatedNotes = state.notes.map(note =>
							note.id === newNote.id ? newNote : note
						);
						
						return {
							notes: updatedNotes,
							selectedNote: state.selectedNote?.id === newNote.id ? newNote : state.selectedNote
						};
					});
				},
				
				deleteNote: (noteId) => {
					set(state => ({
						notes: state.notes.filter(note => note.id !== noteId),
						selectedNote: state.selectedNote?.id === noteId ? null : state.selectedNote
					}))
				},
				
				// Note formatting
				updateNoteFormatting: (noteId, formatType, value) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									formatting: {
										...note.formatting,
										[formatType]: value
									},
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				// Folders actions
				setFolders: (folders) => set({ folders }),
				setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
				
				addFolder: (name) => {
					const newFolder = {
						id: Date.now(),
						name,
						createdAt: new Date().toISOString()
					}
					set(state => ({
						folders: [...state.folders, newFolder]
					}))
					return newFolder
				},
				
				deleteFolder: (folderId) => {
					set(state => ({
						folders: state.folders.filter(folder => folder.id !== folderId),
						notes: state.notes.map(note =>
							note.folderId === folderId ? { ...note, folderId: null } : note
						),
						selectedFolder: state.selectedFolder === folderId ? null : state.selectedFolder
					}))
				},
				
				renameFolder: (folderId, newName) => {
					set(state => ({
						folders: state.folders.map(folder =>
							folder.id === folderId
								? { ...folder, name: newName, updatedAt: new Date().toISOString() }
								: folder
						)
					}))
				},
				
				// Tags actions
				addTagToNote: (noteId, tag) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId && !note.tags.includes(tag)
								? {
									...note,
									tags: [...note.tags, tag],
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				removeTagFromNote: (noteId, tagToRemove) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									tags: note.tags.filter(tag => tag !== tagToRemove),
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				// Comments actions
				addComment: (noteId, content) => {
					const newComment = {
						id: Date.now(),
						content,
						createdAt: new Date().toISOString(),
						author: 'Current User', // Можно заменить на реального пользователя
						authorInitial: 'C'
					}
					
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									comments: [...(note.comments || []), newComment],
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
					return newComment
				},
				
				editComment: (noteId, commentId, newContent) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									comments: note.comments.map(comment =>
										comment.id === commentId
											? {
												...comment,
												content: newContent,
												updatedAt: new Date().toISOString()
											}
											: comment
									),
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				deleteComment: (noteId, commentId) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									comments: note.comments.filter(comment => comment.id !== commentId),
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				// Other note actions
				togglePinNote: (noteId) => {
					set(state => {
						const updatedNotes = state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									isPinned: !note.isPinned,
									updatedAt: new Date().toISOString()
								}
								: note
						);
						
						// Находим обновленную заметку
						const updatedNote = updatedNotes.find(note => note.id === noteId);
						
						return {
							notes: updatedNotes,
							// Обновляем selectedNote если это текущая выбранная заметка
							selectedNote: state.selectedNote?.id === noteId ? updatedNote : state.selectedNote
						};
					});
				},
				
				duplicateNote: (noteId) => {
					const noteToDuplicate = get().notes.find(note => note.id === noteId)
					if (noteToDuplicate) {
						const duplicatedNote = {
							...noteToDuplicate,
							id: Date.now(),
							title: `${noteToDuplicate.title} (copy)`,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						}
						set(state => ({
							notes: [...state.notes, duplicatedNote]
						}))
						return duplicatedNote
					}
					return null
				},
				
				moveNoteToFolder: (noteId, folderId) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									folderId,
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				attachFileToNote: (noteId, file) => {
					set(state => ({
						notes: state.notes.map(note =>
							note.id === noteId
								? {
									...note,
									attachments: [...note.attachments, file],
									updatedAt: new Date().toISOString()
								}
								: note
						)
					}))
				},
				
				// Search
				setSearchTerm: (term) => set({ searchTerm: term }),
				
				// Error handling
				setError: (error) => set({ error }),
				clearError: () => set({ error: null }),
				
				// Loading state
				setLoading: (isLoading) => set({ isLoading }),
				
				// Selectors
				getFilteredNotes: () => {
					const state = get();
					return state.notes
						.filter(note =>
							(state.selectedFolder ? note.folderId === state.selectedFolder : true) &&
							(state.searchTerm
								? note.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
								note.content.toLowerCase().includes(state.searchTerm.toLowerCase())
								: true)
						)
						.sort((a, b) => {
							// Сначала сортируем по закрепленности
							if (a.isPinned !== b.isPinned) {
								return a.isPinned ? -1 : 1;
							}
							// Если статус закрепления одинаковый, сортируем по дате обновления
							return new Date(b.updatedAt) - new Date(a.updatedAt);
						});
				},
				
				getNoteById: (noteId) => get().notes.find(note => note.id === noteId),
				getFolderById: (folderId) => get().folders.find(folder => folder.id === folderId),
				getCurrentFormatting: () => get().selectedNote?.formatting || initialFormatting,
				
				// Reset store
				reset: () => {
					set(initialState)
				}
			}),
			{
				name: 'notes-storage',
				version: 1,
			}
		)
	)
)

export default useNotesStore