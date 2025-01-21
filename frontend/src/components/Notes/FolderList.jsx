import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Folder, MoreHorizontal, ChevronRight, ChevronDown, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import useNotesStore from "@/Stores/NotesStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

function FolderList() {
	const [editingFolderId, setEditingFolderId] = useState(null)
	const [editingFolderName, setEditingFolderName] = useState("")
	const [expandedFolders, setExpandedFolders] = useState({})
	const [deletingFolderId, setDeletingFolderId] = useState(null)
	
	const folders = useNotesStore((state) => state.folders)
	const selectedFolder = useNotesStore((state) => state.selectedFolder)
	const setSelectedFolder = useNotesStore((state) => state.setSelectedFolder)
	const deleteFolder = useNotesStore((state) => state.deleteFolder)
	const renameFolder = useNotesStore((state) => state.renameFolder)
	
	const handleRename = (folderId) => {
		if (editingFolderName.trim()) {
			renameFolder(folderId, editingFolderName.trim())
			setEditingFolderId(null)
			setEditingFolderName("")
		}
	}
	
	const handleDeleteConfirm = () => {
		if (deletingFolderId) {
			deleteFolder(deletingFolderId)
			setDeletingFolderId(null)
		}
	}
	
	const toggleFolder = (folderId) => {
		setExpandedFolders((prev) => ({
			...prev,
			[folderId]: !prev[folderId],
		}))
	}
	
	const getChildFolders = (parentId) => {
		return folders.filter((folder) => folder.parentId === parentId)
	}
	
	const truncateString = (str, maxLength) => {
		if (str.length <= maxLength) return str
		return str.slice(0, maxLength) + "..."
	}
	
	const FolderItem = ({ folder, level = 0 }) => {
		const hasChildren = getChildFolders(folder.id).length > 0
		const isExpanded = expandedFolders[folder.id]
		const children = getChildFolders(folder.id)
		
		return (
			<div className="w-full">
				<div className="flex items-center w-full group">
					<div
						className="flex items-center w-full hover:bg-accent rounded-lg transition-colors"
						style={{ paddingLeft: `${level * 4}px` }}
					>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 p-0 mr-1"
							onClick={(e) => {
								e.stopPropagation()
								toggleFolder(folder.id)
							}}
						>
							{hasChildren && (isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
						</Button>
						
						<Button
							variant={selectedFolder === folder.id ? "secondary" : "ghost"}
							className="flex-1 justify-start h-7 px-2 mr-1 truncate"
							onClick={() => setSelectedFolder(folder.id)}
							title={folder.fullName || folder.name}
						>
							<Folder className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
							<span className="truncate">{folder.name}</span>
						</Button>
						
						{!folder.isTaskNotesRoot && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-40">
									<DropdownMenuItem
										onClick={() => {
											setEditingFolderId(folder.id)
											setEditingFolderName(folder.fullName || folder.name)
										}}
										className="text-sm font-medium cursor-pointer"
									>
										<Edit className="h-4 w-4 mr-2" />
										Rename
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setDeletingFolderId(folder.id)}
										className="text-sm font-medium cursor-pointer text-destructive focus:text-destructive"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
				
				{isExpanded && children.length > 0 && (
					<div className="ml-1">
						{children.map((childFolder) => (
							<FolderItem key={childFolder.id} folder={childFolder} level={level + 1} />
						))}
					</div>
				)}
			</div>
		)
	}
	
	// Получаем корневые папки (без parentId)
	const rootFolders = folders.filter((folder) => !folder.parentId)
	
	return (
		<ScrollArea className="h-[calc(100vh-5rem)]">
			<div className="p-1 space-y-1">
				<Button
					variant={selectedFolder === null ? "secondary" : "ghost"}
					className="w-full justify-start h-7 mb-1"
					onClick={() => setSelectedFolder(null)}
				>
					<Folder className="mr-2 h-3.5 w-3.5" />
					<span className="truncate">All Notes</span>
				</Button>
				
				{rootFolders.map((folder) => (
					<FolderItem key={folder.id} folder={folder} />
				))}
			</div>
			
			{editingFolderId && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-background p-4 rounded-lg w-72">
						<Input
							value={editingFolderName}
							onChange={(e) => setEditingFolderName(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleRename(editingFolderId)}
							autoFocus
							className="mb-4"
						/>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setEditingFolderId(null)}>
								Cancel
							</Button>
							<Button onClick={() => handleRename(editingFolderId)}>Save</Button>
						</div>
					</div>
				</div>
			)}
			
			<AlertDialog open={!!deletingFolderId} onOpenChange={() => setDeletingFolderId(null)}>
				<AlertDialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. The folder and all notes inside it will be deleted forever.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ScrollArea>
	)
}

export default FolderList

