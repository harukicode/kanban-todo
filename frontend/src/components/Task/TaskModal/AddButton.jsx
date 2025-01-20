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
  MessageCircle,
  Plus,
  FileText,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export function AddButton({
                            dueDate,
                            comments,
                            description,
                            onDueDateChange,
                            onDescriptionChange,
                            onNoteCreate,
                          }) {
  const [isMainPopoverOpen, setIsMainPopoverOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dueDate);
  
  useEffect(() => {
    setSelectedDate(dueDate || null);
  }, [dueDate]);
  
  const handleDateSelect = (date) => {
    const formattedDate = date ? date.toISOString() : null;
    setSelectedDate(formattedDate);
    onDueDateChange(formattedDate);
    setIsCalendarOpen(false);
    setIsMainPopoverOpen(false);
  };
  
  // Обработчик для предотвращения рекурсии фокуса
  const handleOpenAutoFocus = (e) => {
    // Предотвращаем автофокус для всех поповеров
    e.preventDefault();
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
        className="w-[200px] p-2"
        sideOffset={5}
        onOpenAutoFocus={handleOpenAutoFocus} // Добавляем обработчик
        onInteractOutside={(e) => {
          if (!isCalendarOpen) {
            setIsMainPopoverOpen(false);
          }
        }}
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
          
          <Popover
            open={isCalendarOpen}
            onOpenChange={setIsCalendarOpen}
            modal={true}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCalendarOpen(true);
                }}
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
              onOpenAutoFocus={handleOpenAutoFocus} // Добавляем обработчик
            >
              <Calendar
                mode="single"
                selected={selectedDate ? parseISO(selectedDate) : undefined}
                onSelect={handleDateSelect}
                disabled={false}
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={(e) => {
              e.preventDefault();
              setIsMainPopoverOpen(false);
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Comment
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}