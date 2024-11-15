import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Options</SelectLabel>
          <SelectItem value="solo-women">Solo Women</SelectItem>
          <SelectItem value="solo-men">Solo Men</SelectItem>
          <SelectItem value="couple">Couple</SelectItem>
          <SelectItem value="family">Family</SelectItem>
          <SelectItem value="group">Group</SelectItem>
          <SelectItem value="business">Business</SelectItem>  
          <SelectItem value="seniors">Seniors</SelectItem>                    
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
