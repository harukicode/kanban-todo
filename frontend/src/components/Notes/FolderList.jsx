// В FolderList.jsx обновим компонент, оптимизировав отступы и работу с длинными названиями

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Trash2, Edit, ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import useNotesStore from '@/Stores/NotesStore'

function FolderList() {
	const [editingFolderId, setEditingFolderId] = useState(null);
	const [editingFolderName, setEditingFolderName] = useState('');
	const [expandedFolders, setExpandedFolders] = useState({});
	
	const folders = useNotesStore(state => state.folders);
	const selectedFolder = useNotesStore(state => state.selectedFolder);
	const setSelectedFolder = useNotesStore(state => state.setSelectedFolder);
	const deleteFolder = useNotesStore(state => state.deleteFolder);
	const renameFolder = useNotesStore(state => state.renameFolder);
	
	const handleRename = (folderId) => {
		if (editingFolderName.trim()) {
			renameFolder(folderId, editingFolderName.trim());
			setEditingFolderId(null);
			setEditingFolderName('');
		}
	};
	
	const toggleFolder = (folderId) => {
		setExpandedFolders(prev => ({
			...prev,
			[folderId]: !prev[folderId]
		}));
	};
	
	const getChildFolders = (parentId) => {
		return folders.filter(folder => folder.parentId === parentId);
	};
	
	const truncateString = (str, maxLength) => {
		if (str.length <= maxLength) return str;
		return str.slice(0, maxLength) + '...';
	};
	
	const FolderItem = ({ folder, level = 0 }) => {
		const hasChildren = getChildFolders(folder.id).length > 0;
		const isExpanded = expandedFolders[folder.id];
		const children = getChildFolders(folder.id);
		
		// Рассчитываем доступное пространство для названия
		// Учитываем: отступ слева (level * 8px) + иконка папки (24px) + кнопки действий (80px)
		const maxNameLength = 20 - (level * 2); // Уменьшаем максимальную длину с учетом уровня вложенности
		const displayName = truncateString(folder.name, maxNameLength);
		
		return (
			<div className="w-full">
				<div className="flex items-center w-full group">
					<div
						className="flex items-center flex-1 hover:bg-accent rounded-lg transition-colors pr-1"
						style={{ paddingLeft: `${level * 8}px` }} // Уменьшили отступ с 12px до 8px
					>
						<div className="flex items-center min-w-0 flex-1">
							{hasChildren ? (
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 p-0"
									onClick={(e) => {
										e.stopPropagation();
										toggleFolder(folder.id);
									}}
								>
									{isExpanded ? (
										<ChevronDown className="h-3 w-3" />
									) : (
										<ChevronRight className="h-3 w-3" />
									)}
								</Button>
							) : (
								<div className="w-6" />
							)}
							
							<Button
								variant={selectedFolder === folder.id ? "secondary" : "ghost"}
								className="flex-1 justify-start h-7 px-1.5"
								onClick={() => setSelectedFolder(folder.id)}
								title={folder.fullName || folder.name}
							>
								<Folder className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
								<span className="truncate">{displayName}</span>
							</Button>
						</div>
						
						{!folder.isTaskNotesRoot && (
							<div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
								<Button
									size="icon"
									variant="ghost"
									className="h-6 w-6"
									title="Edit folder name"
									onClick={(e) => {
										e.stopPropagation();
										setEditingFolderId(folder.id);
										setEditingFolderName(folder.fullName || folder.name);
									}}
								>
									<Edit className="h-3 w-3" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="h-6 w-6"
									title="Delete folder"
									onClick={(e) => {
										e.stopPropagation();
										if (confirm('Are you sure you want to delete this folder and all its notes?')) {
											deleteFolder(folder.id);
										}
									}}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						)}
					</div>
				</div>
				
				{isExpanded && children.length > 0 && (
					<div className="ml-2"> {/* Уменьшили отступ вложенных папок */}
						{children.map(childFolder => (
							<FolderItem
								key={childFolder.id}
								folder={childFolder}
								level={level + 1}
							/>
						))}
					</div>
				)}
			</div>
		);
	};
	
	// Получаем корневые папки (без parentId)
	const rootFolders = folders.filter(folder => !folder.parentId);
	
	return (
		<ScrollArea className="h-[calc(100vh-5rem)]">
			<div className="p-1.5 space-y-0.5"> {/* Уменьшили отступы */}
				<Button
					variant={selectedFolder === null ? "secondary" : "ghost"}
					className="w-full justify-start h-7 mb-1"
					onClick={() => setSelectedFolder(null)}
				>
					<Folder className="mr-1.5 h-3.5 w-3.5" />
					<span className="truncate">All Notes</span>
				</Button>
				
				{rootFolders.map(folder => (
					<FolderItem key={folder.id} folder={folder} />
				))}
			</div>
			
			{editingFolderId && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-background p-4 rounded-lg w-72">
						<Input
							value={editingFolderName}
							onChange={(e) => setEditingFolderName(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleRename(editingFolderId)}
							autoFocus
							className="mb-4"
						/>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setEditingFolderId(null)}
							>
								Cancel
							</Button>
							<Button
								onClick={() => handleRename(editingFolderId)}
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			)}
		</ScrollArea>
	);
}

export default FolderList;