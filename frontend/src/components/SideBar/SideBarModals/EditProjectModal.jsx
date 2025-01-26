import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colorOptions } from "@/constants/SideBar/colorOptions";

const EditProjectModal = ({ isOpen, onClose, onEditProject, project }) => {
  // Локальное состояние для формы
  const [localProject, setLocalProject] = useState(null);
  
  // Синхронизация с внешними данными
  useEffect(() => {
    if (isOpen && project) {
      setLocalProject({
        name: project.name,
        color: project.color
      });
    } else {
      setLocalProject(null);
    }
  }, [isOpen, project]);
  
  // Обработчики
  const handleClose = useCallback(() => {
    setLocalProject(null);
    onClose();
  }, [onClose]);
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!localProject || !localProject.name.trim()) return;
    
    try {
      await onEditProject(project.id, {
        name: localProject.name.trim(),
        color: localProject.color
      });
      handleClose();
    } catch (error) {
      console.error('Failed to edit project:', error);
    }
  }, [localProject, project?.id, onEditProject, handleClose]);
  
  // Если нет данных, не показываем модальное окно
  if (!localProject) return null;
  
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                Name
              </Label>
              <Input
                autoComplete="off"
                id="projectName"
                value={localProject.name}
                onChange={(e) => setLocalProject(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Color</Label>
              <div className="flex gap-2 col-span-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full cursor-pointer ${
                      localProject.color === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setLocalProject(prev => ({
                      ...prev,
                      color
                    }))}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!localProject.name.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;