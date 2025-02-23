import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

const API_URL = 'http://localhost:5000/api';

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
			(set, get) => ({
				...initialState,
				taskNotesRootFolder: null,
				
				// Инициализация данных
				fetchNotes: async () => {
					set({ isLoading: true, error: null });
					try {
						const response = await fetch(`${API_URL}/notes`);
						if (!response.ok) throw new Error('Failed to fetch notes');
						const notes = await response.json();
						set({ notes, isLoading: false });
					} catch (error) {
						set({ error: error.message, isLoading: false });
					}
				},
				
				fetchFolders: async () => {
					set({ isLoading: true, error: null });
					try {
						const response = await fetch(`${API_URL}/folders`);
						if (!response.ok) throw new Error('Failed to fetch folders');
						const folders = await response.json();
						set({ folders, isLoading: false });
					} catch (error) {
						set({ error: error.message, isLoading: false });
					}
				},
				
				// Инициализация корневой папки для заметок задач
				initTaskNotesFolder: async () => {
					const store = get();
					let rootFolder = store.folders.find(f => f.isTaskNotesRoot);
					
					if (!rootFolder) {
						try {
							const response = await fetch(`${API_URL}/folders`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(TASK_NOTES_ROOT)
							});
							if (!response.ok) throw new Error('Failed to create root folder');
							rootFolder = await response.json();
							set(state => ({
								folders: [...state.folders, rootFolder]
							}));
						} catch (error) {
							console.error('Error creating root folder:', error);
						}
					}
					
					return rootFolder;
				},
				
				// Создание папки для задачи
				createTaskFolder: async (task) => {
					set({ isLoading: true, error: null });
					try {
						const response = await fetch(`${API_URL}/folders/task-folder`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								taskId: task.id,
								taskTitle: task.title
							})
						});
						
						if (!response.ok) throw new Error('Failed to create task folder');
						const taskFolder = await response.json();
						
						set(state => ({
							folders: [...state.folders, taskFolder],
							isLoading: false
						}));
						
						return taskFolder;
					} catch (error) {
						set({ error: error.message, isLoading: false });
						return null;
					}
				},
				
				// Создание заметки для задачи
				createTaskNote: async (task, initialContent = '', title = null) => {
					const store = get();
					const taskFolder = await store.createTaskFolder(task);
					if (!taskFolder) return null;
					
					try {
						const response = await fetch(`${API_URL}/notes`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								title: title || `Note for: ${task.title}`,
								content: initialContent,
								tags: ['task-note'],
								isPinned: false,
								folderId: taskFolder.id,
								taskId: task.id,
								formatting: { ...initialFormatting }
							})
						});
						
						if (!response.ok) throw new Error('Failed to create note');
						const newNote = await response.json();
						
						set(state => ({
							notes: [...state.notes, newNote],
							selectedNote: newNote,
							selectedFolder: taskFolder.id
						}));
						
						return newNote;
					} catch (error) {
						set({ error: error.message });
						return null;
					}
				},
				
				// Базовые операции с заметками
				addNote: async () => {
					const store = get();
					try {
						const response = await fetch(`${API_URL}/notes`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								title: 'New Note',
								content: '',
								tags: [],
								isPinned: false,
								folderId: store.selectedFolder,
								formatting: { ...initialFormatting }
							})
						});
						
						if (!response.ok) throw new Error('Failed to create note');
						const newNote = await response.json();
						
						set(state => ({
							notes: [...state.notes, newNote],
							selectedNote: newNote
						}));
						
						return newNote;
					} catch (error) {
						set({ error: error.message });
						return null;
					}
				},
				
				updateNote: async (updatedNote) => {
					if (!updatedNote?.id) return;
					set({ isLoading: true });
					
					try {
						const response = await fetch(`${API_URL}/notes/${updatedNote.id}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(updatedNote)
						});
						
						if (!response.ok) throw new Error('Failed to update note');
						const note = await response.json();
						
						set(state => ({
							notes: state.notes.map(n => n.id === note.id ? note : n),
							selectedNote: state.selectedNote?.id === note.id ? note : state.selectedNote,
							isLoading: false
						}));
					} catch (error) {
						set({ error: error.message, isLoading: false });
					}
				},
				
				deleteNote: async (noteId) => {
					set({ isLoading: true });
					try {
						const response = await fetch(`${API_URL}/notes/${noteId}`, {
							method: 'DELETE'
						});
						
						if (!response.ok) throw new Error('Failed to delete note');
						
						set(state => ({
							notes: state.notes.filter(note => note.id !== noteId),
							selectedNote: state.selectedNote?.id === noteId ? null : state.selectedNote,
							isLoading: false
						}));
					} catch (error) {
						set({ error: error.message, isLoading: false });
					}
				},
				
				// Управление форматированием
				updateNoteFormatting: async (noteId, formatType, value) => {
					const store = get();
					const note = store.notes.find(n => n.id === noteId);
					if (!note) return;
					
					const updatedNote = {
						...note,
						formatting: {
							...note.formatting,
							[formatType]: value
						}
					};
					
					await store.updateNote(updatedNote);
				},
				
				// Управление папками
				addFolder: async (name, parentId = null) => {
					set({ isLoading: true });
					try {
						const response = await fetch(`${API_URL}/folders`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ name, parentId })
						});
						
						if (!response.ok) throw new Error('Failed to create folder');
						const newFolder = await response.json();
						
						set(state => ({
							folders: [...state.folders, newFolder],
							isLoading: false
						}));
						
						return newFolder;
					} catch (error) {
						set({ error: error.message, isLoading: false });
						return null;
					}
				},
				
				deleteFolder: async (folderId) => {
					const store = get();
					const folderToDelete = store.folders.find(f => f.id === folderId);
					if (folderToDelete?.isTaskNotesRoot) return;
					
					set({ isLoading: true });
					try {
						const response = await fetch(`${API_URL}/folders/${folderId}`, {
							method: 'DELETE'
						});
						
						if (!response.ok) throw new Error('Failed to delete folder');
						
						set(state => ({
							folders: state.folders.filter(folder => folder.id !== folderId),
							selectedFolder: state.selectedFolder === folderId ? null : state.selectedFolder,
							isLoading: false
						}));
					} catch (error) {
						set({ error: error.message, isLoading: false });
					}
				},
				
				renameFolder: async (folderId, newName) => {
					const store = get();
					const folderToRename = store.folders.find(f => f.id === folderId);
					if (folderToRename?.isTaskNotesRoot) return;
					
					set({ isLoading: true });
					try {
						const response = await fetch(`${API_URL}/folders/${folderId}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ name: newName })
						});
						
						if (!response.ok) throw new Error('Failed to rename folder');
						const updatedFolder = await response.json();
						
						set(state => ({
							folders: state.folders.map(f => f.id === folderId ? updatedFolder : f),
							isLoading: false
						}));
					} catch (error) {
						set({ error: error.message, isLoading: false });
					}
				},
				
				// Теги
				addTagToNote: async (noteId, tag) => {
					try {
						const response = await fetch(`${API_URL}/notes/${noteId}/tags`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ tag })
						});
						
						if (!response.ok) throw new Error('Failed to add tag');
						const updatedNote = await response.json();
						
						set(state => ({
							notes: state.notes.map(note => note.id === noteId ? updatedNote : note)
						}));
					} catch (error) {
						set({ error: error.message });
					}
				},
				
				removeTagFromNote: async (noteId, tag) => {
					try {
						const response = await fetch(`${API_URL}/notes/${noteId}/tags/${tag}`, {
							method: 'DELETE'
						});
						
						if (!response.ok) throw new Error('Failed to remove tag');
						const updatedNote = await response.json();
						
						set(state => ({
							notes: state.notes.map(note => note.id === noteId ? updatedNote : note)
						}));
					} catch (error) {
						set({ error: error.message });
					}
				},
				
				// Комментарии
				addComment: async (noteId, content) => {
					try {
						const response = await fetch(`${API_URL}/notes/${noteId}/comments`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								content,
								author: 'Current User',
								authorInitial: 'C'
							})
						});
						
						if (!response.ok) throw new Error('Failed to add comment');
						const updatedNote = await response.json();
						
						set(state => ({
							notes: state.notes.map(note => note.id === noteId ? updatedNote : note)
						}));
						
						return updatedNote.comments[updatedNote.comments.length - 1];
					} catch (error) {
						set({ error: error.message });
						return null;
					}
				},
				
				editComment: async (noteId, commentId, newContent) => {
					try {
						const response = await fetch(`${API_URL}/notes/${noteId}/comments/${commentId}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ content: newContent })
						});
						
						if (!response.ok) throw new Error('Failed to update comment');
						const updatedNote = await response.json();
						
						set(state => ({
							notes: state.notes.map(note => note.id === noteId ? updatedNote : note)
						}));
					} catch (error) {
						set({ error: error.message });
					}
				},
				
				deleteComment: async (noteId, commentId) => {
					try {
						const response = await fetch(`${API_URL}/notes/${noteId}/comments/${commentId}`, {
							method: 'DELETE'
						});
						
						if (!response.ok) throw new Error('Failed to delete comment');
						const updatedNote = await response.json();
						
						set(state => ({
							notes: state.notes.map(note => note.id === noteId ? updatedNote : note)
						}));
					} catch (error) {
						set({ error: error.message });
					}
				},
				
				// Другие действия с заметками
				togglePinNote: async (noteId) => {
					const store = get();
					const note = store.notes.find(n => n.id === noteId);
					if (!note) return;
					
					const updatedNote = { ...note, isPinned: !note.isPinned };
					await store.updateNote(updatedNote);
				},
				
				duplicateNote: async (noteId) => {
					const store = get();
					const noteToDuplicate = store.notes.find(note => note.id === noteId);
					if (!noteToDuplicate) return null;
					
					try {
						set({ isLoading: true });
						const response = await fetch(`${API_URL}/notes/duplicate/${noteId}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							}
						});
						
						if (!response.ok) {
							throw new Error('Failed to duplicate note');
						}
						
						const newNote = await response.json();
						set(state => ({
							notes: [...state.notes, newNote],
							isLoading: false
						}));
						
						return newNote;
					} catch (error) {
						set({ error: error.message, isLoading: false });
						return null;
					}
				},
				
				moveNoteToFolder: async (noteId, folderId) => {
					const store = get();
					const note = store.notes.find(n => n.id === noteId);
					if (!note) return;
					
					const updatedNote = { ...note, folderId };
					await store.updateNote(updatedNote);
				},
				
				// Поиск
				setSearchTerm: (term) => set({ searchTerm: term }),
				
				// Управление состоянием
				setSelectedNote: (note) => set({ selectedNote: note }),
				setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
				setNotes: (notes) => set({ notes }),
				setFolders: (folders) => set({ folders }),
				setError: (error) => set({ error }),
				clearError: () => set({ error: null }),
				setLoading: (isLoading) => set({ isLoading }),
				
				// Получение заметок для задачи
				getTaskNotes: async (taskId) => {
					try {
						const response = await fetch(`${API_URL}/notes/task/${taskId}`);
						if (!response.ok) throw new Error('Failed to fetch task notes');
						return await response.json();
					} catch (error) {
						set({ error: error.message });
						return [];
					}
				},
				
				// Фильтрация заметок
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
				
				// Вспомогательные функции
				getNoteById: (noteId) => get().notes.find(note => note.id === noteId),
				getFolderById: (folderId) => get().folders.find(folder => folder.id === folderId),
				getCurrentFormatting: () => get().selectedNote?.formatting || initialFormatting,
				
				// Инициализация хранилища
				initialize: async () => {
					const store = get();
					set({ isLoading: true, error: null });
					try {
						// Загружаем папки и заметки параллельно
						await Promise.all([
							store.fetchFolders(),
							store.fetchNotes()
						]);
						// Убеждаемся, что корневая папка существует
						await store.initTaskNotesFolder();
					} catch (error) {
						set({ error: error.message });
					} finally {
						set({ isLoading: false });
					}
				},
				
				// Сброс состояния
				reset: () => {
					set(initialState);
				}
			}),
	)
);

export default useNotesStore;