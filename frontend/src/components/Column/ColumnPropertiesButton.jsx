import React, { useCallback, useState } from "react";
import { MoreHorizontal, Trash } from "lucide-react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { IoColorPaletteOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

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

export const ColumnPropertiesButton = React.memo(
  ({
    open,
    setOpen,
    handleOpenModal,
    onColorChange,
    onNameChange,
    columnName,
    onDeleteColumn,
    doneColumn,
    onToggleDoneColumn,
  }) => {
    const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState(columnName);

    const handleColorSelect = useCallback(
      (color) => {
        onColorChange(color);
        setOpen(false);
      },
      [onColorChange, setOpen],
    );

    const handleEditNameClick = useCallback(() => {
      setNewColumnName(columnName);
      setIsEditNameModalOpen(true);
      setOpen(false);
    }, [columnName, setOpen]);

    const handleNameChange = useCallback(() => {
      onNameChange(newColumnName);
      setIsEditNameModalOpen(false);
    }, [newColumnName, onNameChange]);

    const handleDeleteClick = useCallback(() => {
      setIsDeleteAlertOpen(true);
      setOpen(false);
    }, [setOpen]);

    const handleConfirmDelete = useCallback(() => {
      onDeleteColumn();
      setIsDeleteAlertOpen(false);
    }, [onDeleteColumn]);

    return (
      <>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleEditNameClick}>
                <BiEditAlt className="mr-2 h-4 w-4" />
                Edit Column Name
              </DropdownMenuItem>
              <DropdownMenuItem>
                <input
                  type="checkbox"
                  checked={doneColumn}
                  onChange={onToggleDoneColumn}
                  className="mr-2 h-4 w-4"
                />
                Done Column
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
              <DropdownMenuItem
                className="text-red-600"
                onSelect={handleDeleteClick}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog
          open={isEditNameModalOpen}
          onOpenChange={setIsEditNameModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Column Name</DialogTitle>
            </DialogHeader>
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Enter new column name"
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditNameModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleNameChange}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                column and all tasks within it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
);

ColumnPropertiesButton.displayName = "ColumnPropertiesButton";
