"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCalendarStore } from "@/store/calendar-store"

export function CalendarToggle() {
  const { calendarType, setCalendarType } = useCalendarStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Calendar className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle calendar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCalendarType("gregorian")}>Gregorian</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCalendarType("ethiopic")}>Ethiopian</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
