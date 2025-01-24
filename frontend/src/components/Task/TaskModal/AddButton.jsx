"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlignLeft,
  Calendar as CalendarIcon,
  Plus,
  FileText,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export function AddButton({
                            dueDate,
                            description,
                            onDueDateChange,
                            onDescriptionChange,
                            onNoteCreate,
                          }) {
  const [isMainPopoverOpen, setIsMainPopoverOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dueDate);
  
  useEffect(() => {
    setSelectedDate(dueDate || null);
  }, [dueDate]);
  
  const handleDateSelect = (date) => {
    const formattedDate = date ? date.toISOString() : null;
    setSelectedDate(formattedDate);
    onDueDateChange(formattedDate);
    setIsMainPopoverOpen(false);
  };
  
  return (
    <Popover
      open={isMainPopoverOpen}
      onOpenChange={setIsMainPopoverOpen}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMainPopoverOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" /> Add
        </Button>
      </PopoverTrigger>
      
      <PopoverContent
        className="w-[250px] p-2"
        sideOffset={5}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setIsMainPopoverOpen(false);
              onNoteCreate && onNoteCreate();
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Note
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={(e) => {
              e.preventDefault();
              onDescriptionChange();
              setIsMainPopoverOpen(false);
            }}
          >
            <AlignLeft className="mr-2 h-4 w-4" />
            Description
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(parseISO(selectedDate), "PPP")
                  : "Due date"}
              </Button>
            </PopoverTrigger>
            
            <PopoverContent
              className="w-auto p-0"
              align="start"
              side="right"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Calendar
                mode="single"
                selected={selectedDate ? parseISO(selectedDate) : undefined}
                onSelect={(date) => {
                  handleDateSelect(date);
                }}
                disabled={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
}