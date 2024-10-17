import React from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { List, Pencil, Trash } from "lucide-react";
import { useTimerLog } from "@/hooks/Timer/useTimerLog.jsx";

const LogDialog = () => {
  const { isOpen, setIsOpen, logs, handleDeleteLog } = useTimerLog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <List className="mr-2 h-4 w-4" />
          Log
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Timer Log</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold">{log.date}</div>
              <div>{log.task}</div>
              <div>
                {log.startTime} - {log.endTime}
              </div>
              <div>{log.duration}</div>
              <div className="mt-2">
                <Button variant="ghost" size="sm" className="mr-2">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteLog(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDialog;
