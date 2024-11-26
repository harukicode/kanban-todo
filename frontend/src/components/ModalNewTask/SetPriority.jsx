import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaFlag } from "react-icons/fa"

const SetPriority = ({ selectedPriority, setSelectedPriority }) => {
  const priorities = [
    { value: "high", label: "High Priority", color: "text-red-500" },
    { value: "medium", label: "Medium Priority", color: "text-orange-500" },
    { value: "low", label: "Low Priority", color: "text-blue-500" },
    { value: "none", label: "No Priority", color: "text-gray-400" },
  ]
  
  return (
    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Set Priority">
          {selectedPriority && (
            <div className="flex items-center gap-2">
              <FaFlag className={
                priorities.find(p => p.value === selectedPriority)?.color || "text-gray-400"
              } />
              {priorities.find(p => p.value === selectedPriority)?.label || "No Priority"}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {priorities.map((priority) => (
          <SelectItem
            key={priority.value}
            value={priority.value}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <FaFlag className={priority.color} />
              {priority.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SetPriority

