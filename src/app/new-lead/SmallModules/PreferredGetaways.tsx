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
          <SelectItem value="solo-women">Excursion</SelectItem>
          <SelectItem value="solo-men">Countryside</SelectItem>
          <SelectItem value="couple">Weekend</SelectItem>
          <SelectItem value="family">Destination Packages</SelectItem>
          <SelectItem value="group">Others</SelectItem>                   
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
