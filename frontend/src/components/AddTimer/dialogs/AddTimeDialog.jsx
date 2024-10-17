import React from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { useAddTime } from "@/hooks/Timer/useAddTime.jsx";
const AddTimeDialog = () => {
  const {
    isOpen,
    setIsOpen,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    duration,
    handleAddTime,
    handleTimeChange,
  } = useAddTime();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Time
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Time Manually</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[280px] justify-start text-left font-normal`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              From
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => handleTimeChange(e, setStartTime)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              To
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => handleTimeChange(e, setEndTime)}
              className="col-span-3"
            />
          </div>
          <div className="text-center">
            Duration: {duration.hours}h {duration.minutes}m
          </div>
        </div>
        <Button onClick={handleAddTime}>Add</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimeDialog;
