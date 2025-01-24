import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MoveRight } from "lucide-react"
import { cn } from "@/lib/utils"
import useProjectStore from "@/Stores/ProjectsStore"
import useColumnsStore from "@/Stores/ColumnsStore"
import useTaskStore from "@/Stores/TaskStore"

export default function SimplifiedMoveTaskDropdown({ task, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(task.projectId || "")
  const [selectedColumn, setSelectedColumn] = useState(task.columnId || "")
  const { projects } = useProjectStore()
  const { columns } = useColumnsStore()
  const { moveTask } = useTaskStore()
  const dropdownRef = useRef(null)
  
  const availableColumns = columns.filter((column) => column.projectId === selectedProject)
  
  const handleProjectChange = (e) => {
    const newProjectId = e.target.value
    setSelectedProject(newProjectId)
    const newProjectColumns = columns.filter((column) => column.projectId === newProjectId)
    if (newProjectColumns.length > 0) {
      setSelectedColumn(newProjectColumns[0].id)
    } else {
      setSelectedColumn("")
    }
  }
  
  const handleColumnChange = (e) => {
    setSelectedColumn(e.target.value)
  }
  
  const handleMove = () => {
    if (!selectedProject || !selectedColumn) {
      console.error("Project or column not selected", {
        selectedProject,
        selectedColumn,
        availableColumns,
      })
      return
    }
    
    if (selectedProject !== task.projectId || selectedColumn !== task.columnId) {
      console.log("Moving task:", {
        taskId: task.id,
        fromColumnId: task.columnId,
        toColumnId: selectedColumn,
        toProjectId: selectedProject,
      })
      
      moveTask(
        task.timeSpent,
        task.description,
        task.comments,
        task.dueDate,
        task.id,
        task.columnId,
        selectedColumn,
        selectedProject,
      )
      onClose()
    }
  }
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  return (
    <div ref={dropdownRef} className="relative inline-block">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
        <MoveRight size={16} className="mr-2" /> Move
      </Button>
      {isOpen && (
        <div className="absolute z-10 right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-popover p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-select">Project</Label>
            <select
              id="project-select"
              value={selectedProject}
              onChange={handleProjectChange}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                "appearance-none bg-select-arrow bg-no-repeat bg-right",
              )}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="column-select">Column</Label>
            <select
              id="column-select"
              value={selectedColumn}
              onChange={handleColumnChange}
              disabled={!selectedProject || availableColumns.length === 0}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                "appearance-none bg-select-arrow bg-no-repeat bg-right",
              )}
            >
              <option value="">{availableColumns.length === 0 ? "No columns available" : "Select column"}</option>
              {availableColumns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
          <Button
            className="w-full"
            onClick={handleMove}
            disabled={!selectedProject || !selectedColumn || availableColumns.length === 0}
          >
            Move
          </Button>
        </div>
      )}
    </div>
  )
}

