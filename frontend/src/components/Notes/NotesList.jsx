import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Pin } from 'lucide-react'

function NotesList({ notes, selectedNote, onSelectNote }) {
	// Безопасное получение контента из HTML
	const getTextContent = (html) => {
		if (!html) return '';
		// Создаем временный div для парсинга HTML
		const temp = document.createElement('div');
		temp.innerHTML = html;
		return temp.textContent || temp.innerText || '';
	};
	
	return (
		<ScrollArea className="h-[calc(100vh-9.5rem)]">
			{notes && notes.map(note => (
				<div
					key={note.id}
					className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
						selectedNote?.id === note.id ? 'bg-accent' : ''
					}`}
					onClick={() => onSelectNote(note)}
				>
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-medium truncate pr-2">
							{note.title || 'Untitled Note'}
						</h3>
						{note.isPinned && <Pin className="h-4 w-4 shrink-0 text-yellow-500" />}
					</div>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{getTextContent(note.content)}
					</p>
					{note.tags && note.tags.length > 0 && (
						<div className="flex gap-2 mt-2 flex-wrap">
							{note.tags.map(tag => (
								<Badge key={tag} variant="secondary" className="max-w-[150px]">
									<span className="truncate">{tag}</span>
								</Badge>
							))}
						</div>
					)}
				</div>
			))}
			{notes && notes.length === 0 && (
				<div className="p-4 text-center text-muted-foreground">
					No notes found
				</div>
			)}
		</ScrollArea>
	);
}

export default NotesList;