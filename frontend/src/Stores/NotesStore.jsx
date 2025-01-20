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
};

const TASK_NOTES_ROOT = {
	id: 'task-notes-root',
	name: 'Task Notes',
	createdAt: new Date().toISOString(),
	isTaskNotesRoot: true,
};

const initialState = {
	notes: [],
	folders: [TASK_NOTES_ROOT],
	selectedNote: null,
	selectedFolder: null,
	searchTerm: '',
	isLoading: false,
	error: null
};

const useNotesStore = create(
	devtools(
		persist(
			(set, get) => ({
				// Добавим в initialState
				...initialState,
				taskNotesRootFolder: null, // Корневая папка для всех заметок задач
				
				// Добавляем новые функции
				initTaskNotesFolder: () => {
					const store = get();
					let rootFolder = store.folders.find(f => f.isTaskNotesRoot);
					
					if (!rootFolder) {
						rootFolder = TASK_NOTES_ROOT;
						set(state => ({
							folders: [...state.folders, rootFolder]
						}));
					}
					
					return rootFolder;
				},
				
				createTaskFolder: (task) => {
					const store = get();
					const rootFolder = store.folders.find(f => f.isTaskNotesRoot) || store.initTaskNotesFolder();
					
					// Проверяем существование папки для задачи
					let taskFolder = store.folders.find(f => f.taskId === task.id);
					
					if (!taskFolder) {
						// Укорачиваем название задачи до 20 символов
						const truncatedTitle = task.title.length > 20
							? task.title.substring(0, 20) + '...'
							: task.title;
						
						taskFolder = {
							id: `task-folder-${Date.now()}`,
							name: `Task: ${truncatedTitle}`, // Используем более короткий префикс
							fullName: `Notes for: ${task.title}`, // Сохраняем полное название для тултипа
							createdAt: new Date().toISOString(),
							parentId: rootFolder.id,
							taskId: task.id,
							isTaskFolder: true // Оставляем флаг, но разрешаем редактирование
						};
						
						set(state => ({
							folders: [...state.folders, taskFolder]
						}));
					}
					
					return taskFolder;
				},
				
				createTaskNote: (task, initialContent = '') => {
					const store = get();
					const taskFolder = store.createTaskFolder(task);
					
					const newNote = {
						id: Date.now(),
						title: `Note: ${task.title}`,
						content: initialContent,
						tags: ['task-note'],
						isPinned: false,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						folderId: taskFolder.id,
						taskId: task.id,
						formatting: { ...initialFormatting },
						comments: []
					};
					
					set(state => ({
						notes: [...state.notes, newNote],
						selectedNote: newNote,
						selectedFolder: taskFolder.id
					}));
					
					return newNote;
				},
				
				
				// Дополнительно: получение всех заметок для конкретной задачи
				getTaskNotes: (taskId) => {
					return get().notes.filter(note => note.taskId === taskId);
				},
				
				// Базовые операции с заметками
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
						comments: []
					};
					set(state => ({
						notes: [...state.notes, newNote],
						selectedNote: newNote
					}));
					return newNote;
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
					console.log('NotesStore deleteNote called with id:', noteId);
					set(state => {
						console.log('Current notes:', state.notes);
						const filteredNotes = state.notes.filter(note => note.id !== noteId);
						console.log('Filtered notes:', filteredNotes);
						return {
							notes: filteredNotes,
							selectedNote: state.selectedNote?.id === noteId ? null : state.selectedNote
						};
					});
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
				
				// Управление папками
				setFolders: (folders) => set({ folders }),
				setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
				
				addFolder: (name, parentId = null) => {
					const newFolder = {
						id: Date.now().toString(),
						name,
						parentId,
						createdAt: new Date().toISOString()
					};
					set(state => ({
						folders: [...state.folders, newFolder]
					}));
					return newFolder;
				},
				
				deleteFolder: (folderId) => {
					const store = get();
					const folderToDelete = store.folders.find(f => f.id === folderId);
					
					// Защита от удаления системных папок
					if (folderToDelete?.isTaskNotesRoot) return;
					
					set(state => ({
						folders: state.folders.filter(folder => folder.id !== folderId),
						notes: state.notes.map(note =>
							note.folderId === folderId ? { ...note, folderId: null } : note
						),
						selectedFolder: state.selectedFolder === folderId ? null : state.selectedFolder
					}));
				},
				
				renameFolder: (folderId, newName) => {
					const store = get();
					const folderToRename = store.folders.find(f => f.id === folderId);
					
					// Защита от переименования системных папок
					if (folderToRename?.isTaskNotesRoot) return;
					
					set(state => ({
						folders: state.folders.map(folder =>
							folder.id === folderId
								? { ...folder, name: newName, updatedAt: new Date().toISOString() }
								: folder
						)
					}));
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
				
				// Search
				setSearchTerm: (term) => set({ searchTerm: term }),
				
				// Error handling
				setError: (error) => set({ error }),
				clearError: () => set({ error: null }),
				
				// Loading state
				setLoading: (isLoading) => set({ isLoading }),
				
				// Модифицируем getFilteredNotes для поддержки иерархии папок
				getFilteredNotes: () => {
					const state = get();
					return state.notes
						.filter(note => {
							const folderMatch = state.selectedFolder
								? note.folderId === state.selectedFolder
								: true;
							
							const searchMatch = state.searchTerm
								? note.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
								note.content.toLowerCase().includes(state.searchTerm.toLowerCase())
								: true;
							
							return folderMatch && searchMatch;
						})
						.sort((a, b) => {
							if (a.isPinned !== b.isPinned) {
								return a.isPinned ? -1 : 1;
							}
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