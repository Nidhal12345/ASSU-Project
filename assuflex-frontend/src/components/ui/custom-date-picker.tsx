import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CustomDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  yearRange?: { start: number; end: number }
}

export function CustomDatePicker({
  date,
  onDateChange,
  placeholder = "Sélectionner une date",
  className,
  yearRange = { start: 1950, end: 2050 },
}: CustomDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(date || new Date())

  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.start + i
  )

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(parseInt(monthIndex))
    setViewDate(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(parseInt(year))
    setViewDate(newDate)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate)
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setViewDate(newDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border border-border",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: fr }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border border-border shadow-md" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[110px] h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[80px] h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onDateChange(date)
            setOpen(false)
          }}
          month={viewDate}
          onMonthChange={setViewDate}
          initialFocus
          locale={fr}
          className="p-0"
        />
      </PopoverContent>
    </Popover>
  )
}