import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Italic, Underline, Strikethrough, Type, Smile } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

function CommentInput({ onSubmit }) {
	const [comment, setComment] = useState('');
	const [inputRef, setInputRef] = useState(null);
	
	const handleFormat = (type, value) => {
		if (!inputRef) return;
		
		const start = inputRef.selectionStart;
		const end = inputRef.selectionEnd;
		const text = comment;
		
		let formattedText;
		let newCursorPosition;
		
		switch (type) {
			case 'bold':
				formattedText = text.slice(0, start) + `**${text.slice(start, end)}**` + text.slice(end);
				newCursorPosition = end + 4;
				break;
			case 'italic':
				formattedText = text.slice(0, start) + `*${text.slice(start, end)}*` + text.slice(end);
				newCursorPosition = end + 2;
				break;
			case 'underline':
				formattedText = text.slice(0, start) + `__${text.slice(start, end)}__` + text.slice(end);
				newCursorPosition = end + 4;
				break;
			case 'strike':
				formattedText = text.slice(0, start) + `~~${text.slice(start, end)}~~` + text.slice(end);
				newCursorPosition = end + 4;
				break;
			case 'size':
				formattedText = text.slice(0, start) + `<size=${value}>${text.slice(start, end)}</size>` + text.slice(end);
				newCursorPosition = end + value.length + 15;
				break;
			default:
				return;
		}
		
		setComment(formattedText);
		setTimeout(() => {
			inputRef.focus();
			inputRef.setSelectionRange(newCursorPosition, newCursorPosition);
		}, 0);
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (comment.trim()) {
			onSubmit(comment);
			setComment('');
		}
	};
	
	return (
		<form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2 border-t">
			<div className="flex items-center gap-1 p-1 border rounded-md bg-background">
				<Toggle
					size="sm"
					onClick={() => handleFormat('bold')}
					aria-label="Toggle bold"
				>
					<Bold className="h-4 w-4" />
				</Toggle>
				
				<Toggle
					size="sm"
					onClick={() => handleFormat('italic')}
					aria-label="Toggle italic"
				>
					<Italic className="h-4 w-4" />
				</Toggle>
				
				<Toggle
					size="sm"
					onClick={() => handleFormat('underline')}
					aria-label="Toggle underline"
				>
					<Underline className="h-4 w-4" />
				</Toggle>
				
				<Toggle
					size="sm"
					onClick={() => handleFormat('strike')}
					aria-label="Toggle strikethrough"
				>
					<Strikethrough className="h-4 w-4" />
				</Toggle>
				
				<Separator orientation="vertical" className="h-4" />
				
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="sm" className="px-2">
							<Type className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-40 p-2">
						<div className="flex flex-col gap-1">
							{['small', 'normal', 'large'].map((size) => (
								<Button
									key={size}
									variant="ghost"
									size="sm"
									onClick={() => handleFormat('size', size)}
									className="justify-start"
								>
									{size.charAt(0).toUpperCase() + size.slice(1)}
								</Button>
							))}
						</div>
					</PopoverContent>
				</Popover>
			</div>
			
			<div className="flex gap-2">
				<Input
					ref={(ref) => setInputRef(ref)}
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Напишите комментарий..."
					className="flex-1"
				/>
				<Button type="button" variant="ghost" size="icon">
					<Smile className="h-4 w-4" />
				</Button>
				<Button type="submit">Отправить</Button>
			</div>
		</form>
	);
}

export default CommentInput;