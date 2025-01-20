import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useNotesStore from '@/Stores/NotesStore';

export function TaskNoteModal({ isOpen, onClose, task }) {
	const [title, setTitle] = useState(`Note for: ${task.title}`);
	const [content, setContent] = useState('');
	const createTaskNote = useNotesStore(state => state.createTaskNote);
	
	// Конфигурация панели инструментов
	const modules = {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'align': [] }],
			['clean']
		],
	};
	
	const handleSave = () => {
		createTaskNote(task, content);
		setContent('');
		setTitle(`Note for: ${task.title}`);
		onClose();
	};
	
	const handleClose = () => {
		setContent('');
		setTitle(`Note for: ${task.title}`);
		onClose();
	};
	
	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
				<DialogHeader className="shrink-0">
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="text-xl font-bold"
						placeholder="Note title"
					/>
				</DialogHeader>
				
				<div className="flex-grow mt-4 overflow-hidden">
					<ReactQuill
						theme="snow"
						value={content}
						onChange={setContent}
						modules={modules}
						className="h-[calc(100%-40px)]" // Оставляем место для toolbar
						placeholder="Start writing your note..."
					/>
				</div>
				
				<DialogFooter className="mt-4 shrink-0">
					<Button variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>
						Create Note
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}