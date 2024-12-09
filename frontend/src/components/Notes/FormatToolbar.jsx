import { Separator } from '@radix-ui/react-select'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Type,
	Palette
} from 'lucide-react';
import useNotesStore from '@/Stores/NotesStore.jsx';

function FormatToolbar() {
	const selectedNote = useNotesStore(state => state.selectedNote);
	const updateNoteFormatting = useNotesStore(state => state.updateNoteFormatting);
	const currentFormatting = useNotesStore(state => state.getCurrentFormatting());
	
	const colors = [
		'#000000', '#e60000', '#ff9900', '#ffff00',
		'#008a00', '#0066cc', '#9933ff', '#ffffff'
	];
	
	const sizes = [
		{ label: 'Маленький', value: 'small' },
		{ label: 'Обычный', value: 'normal' },
		{ label: 'Большой', value: 'large' }
	];
	
	const handleFormat = (type, value) => {
		if (!selectedNote) return;
		
		if (value === undefined) {
			// Для toggle-кнопок (bold, italic, underline, strike)
			value = !currentFormatting[type];
		}
		
		updateNoteFormatting(selectedNote.id, type, value);
	};
	
	// Определяем, какая иконка выравнивания должна отображаться
	const AlignIcon = {
		'left': AlignLeft,
		'center': AlignCenter,
		'right': AlignRight
	}[currentFormatting.align] || AlignLeft;
	
	return (
		<div className="flex items-center gap-1 p-1 border rounded-md bg-background">
			<Toggle
				size="sm"
				pressed={currentFormatting.bold}
				onClick={() => handleFormat('bold')}
				aria-label="Toggle bold"
				disabled={!selectedNote}
			>
				<Bold className="h-4 w-4" />
			</Toggle>
			
			<Toggle
				size="sm"
				pressed={currentFormatting.italic}
				onClick={() => handleFormat('italic')}
				aria-label="Toggle italic"
				disabled={!selectedNote}
			>
				<Italic className="h-4 w-4" />
			</Toggle>
			
			<Toggle
				size="sm"
				pressed={currentFormatting.underline}
				onClick={() => handleFormat('underline')}
				aria-label="Toggle underline"
				disabled={!selectedNote}
			>
				<Underline className="h-4 w-4" />
			</Toggle>
			
			<Toggle
				size="sm"
				pressed={currentFormatting.strike}
				onClick={() => handleFormat('strike')}
				aria-label="Toggle strikethrough"
				disabled={!selectedNote}
			>
				<Strikethrough className="h-4 w-4" />
			</Toggle>
			
			<Separator orientation="vertical" className="h-4" />
			
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="sm" className="px-2" disabled={!selectedNote}>
						<AlignIcon className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-40 p-2">
					<div className="flex flex-col gap-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleFormat('align', 'left')}
							className="justify-start"
						>
							<AlignLeft className="h-4 w-4 mr-2" />
							По левому краю
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleFormat('align', 'center')}
							className="justify-start"
						>
							<AlignCenter className="h-4 w-4 mr-2" />
							По центру
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleFormat('align', 'right')}
							className="justify-start"
						>
							<AlignRight className="h-4 w-4 mr-2" />
							По правому краю
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="sm" className="px-2" disabled={!selectedNote}>
						<Type className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-40 p-2">
					<div className="flex flex-col gap-1">
						{sizes.map((size) => (
							<Button
								key={size.value}
								variant="ghost"
								size="sm"
								onClick={() => handleFormat('size', size.value)}
								className="justify-start"
							>
								{size.label}
							</Button>
						))}
					</div>
				</PopoverContent>
			</Popover>
			
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="sm" className="px-2" disabled={!selectedNote}>
						<Palette className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-40 p-2">
					<div className="grid grid-cols-4 gap-1">
						{colors.map((color) => (
							<button
								key={color}
								onClick={() => handleFormat('color', color)}
								className="w-6 h-6 rounded-md border"
								style={{
									backgroundColor: color,
									outline: color === currentFormatting.color ? '2px solid #0066cc' : 'none',
									outlineOffset: '2px'
								}}
							/>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default FormatToolbar;