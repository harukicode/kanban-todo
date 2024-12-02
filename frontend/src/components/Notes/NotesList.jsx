import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Pin } from 'lucide-react'

function NotesList({ notes, selectedNote, onSelectNote }) {
	return (
		<ScrollArea className="h-[calc(100vh-5rem)]">
			{notes.map(note => (
				<div
					key={note.id}
					className={`p-4 border-b cursor-pointer hover:bg-accent ${selectedNote && selectedNote.id === note.id ? 'bg-accent' : ''}`}
					onClick={() => onSelectNote(note)}
				>
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-medium">{note.title}</h3>
						{note.isPinned && <Pin className="h-4 w-4" />}
					</div>
					<p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
					<div className="flex gap-2 mt-2">
						{note.tags.map(tag => (
							<Badge key={tag} variant="secondary">{tag}</Badge>
						))}
					</div>
				</div>
			))}
		</ScrollArea>
	)
}

export default NotesList

