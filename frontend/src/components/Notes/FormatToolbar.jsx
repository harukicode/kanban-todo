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

function FormatToolbar({ onFormat }) {
	const colors = [
		'#000000', '#e60000', '#ff9900', '#ffff00',
		'#008a00', '#0066cc', '#9933ff', '#ffffff'
	];
	
	const sizes = [
		{ label: 'Маленький', value: 'small' },
		{ label: 'Обычный', value: 'normal' },
		{ label: 'Большой', value: 'large' }
	];
	
	return (
		<div className="flex items-center gap-1 p-1 border rounded-md bg-background">
			<Toggle
				size="sm"
				onClick={() => onFormat('bold')}
				aria-label="Toggle bold"
			>
				<Bold className="h-4 w-4" />
			</Toggle>
			
			<Toggle
				size="sm"
				onClick={() => onFormat('italic')}
				aria-label="Toggle italic"
			>
				<Italic className="h-4 w-4" />
			</Toggle>
			
			<Toggle
				size="sm"
				onClick={() => onFormat('underline')}
				aria-label="Toggle underline"
			>
				<Underline className="h-4 w-4" />
			</Toggle>
			
			<Toggle
				size="sm"
				onClick={() => onFormat('strike')}
				aria-label="Toggle strikethrough"
			>
				<Strikethrough className="h-4 w-4" />
			</Toggle>
			
			<Separator orientation="vertical" className="h-4" />
			
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="sm" className="px-2">
						<AlignLeft className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-40 p-2">
					<div className="flex flex-col gap-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onFormat('align', 'left')}
							className="justify-start"
						>
							<AlignLeft className="h-4 w-4 mr-2" />
							По левому краю
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onFormat('align', 'center')}
							className="justify-start"
						>
							<AlignCenter className="h-4 w-4 mr-2" />
							По центру
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onFormat('align', 'right')}
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
					<Button variant="ghost" size="sm" className="px-2">
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
								onClick={() => onFormat('size', size.value)}
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
					<Button variant="ghost" size="sm" className="px-2">
						<Palette className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-40 p-2">
					<div className="grid grid-cols-4 gap-1">
						{colors.map((color) => (
							<button
								key={color}
								onClick={() => onFormat('color', color)}
								className="w-6 h-6 rounded-md border"
								style={{ backgroundColor: color }}
							/>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default FormatToolbar;