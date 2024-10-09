"use client"

import React, { useCallback } from "react"
import { MoreHorizontal, Trash } from "lucide-react"
import { AiOutlineFolderAdd } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { IoColorPaletteOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button"
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const labels = ["feature", "bug", "enhancement", "documentation", "design", "question", "maintenance"];

const colors = [
	{ name: "Purple", value: "#9333ea" },
	{ name: "Blue", value: "#3b82f6" },
	{ name: "Green", value: "#22c55e" },
	{ name: "Yellow", value: "#eab308" },
	{ name: "Red", value: "#ef4444" },
	{ name: "Pink", value: "#ec4899" },
	{ name: "Indigo", value: "#6366f1" },
	{ name: "Teal", value: "#14b8a6" },
];

export const ColumnPropertiesButton = React.memo(({ setLabel, open, setOpen, handleOpenModal, onColorChange }) => {
	const handleLabelSelect = useCallback((value) => {
		setLabel(value);
		setOpen(false);
	}, [setLabel, setOpen]);
	
	const handleColorSelect = useCallback((color) => {
		onColorChange(color);
		setOpen(false);
	}, [onColorChange, setOpen]);
	
	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={handleOpenModal}>
						<AiOutlineFolderAdd className="mr-2 h-4 w-4" />
						Create New Task
					</DropdownMenuItem>
					<DropdownMenuItem>
						<BiEditAlt className="mr-2 h-4 w-4" />
						Edit Column Name
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<IoColorPaletteOutline className="mr-2 h-4 w-4" />
							Change Color
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="p-0">
							<Command>
								<CommandList>
									<CommandGroup>
										{colors.map((color) => (
											<CommandItem
												key={color.name}
												onSelect={() => handleColorSelect(color.value)}
											>
												<div className="flex items-center">
													<div
														className="w-4 h-4 rounded-full mr-2"
														style={{ backgroundColor: color.value }}
													></div>
													{color.name}
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-red-600">
						<Trash className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

ColumnPropertiesButton.displayName = 'ColumnPropertiesButton';