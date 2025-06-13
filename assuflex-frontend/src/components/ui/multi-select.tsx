"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  maxDisplay?: number
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  className,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
    onChange(newValue)
  }

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const displayedValues = value.slice(0, maxDisplay)
  const remainingCount = value.length - maxDisplay

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex min-h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm cursor-pointer transition-colors",
          "hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20",
          isOpen && "border-blue-500 ring-2 ring-blue-500/20",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1 items-center">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <>
              {displayedValues.map((v) => {
                const option = options.find((o) => o.value === v)
                return (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    {option?.label || v}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={(e) => removeOption(v, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })}
              {remainingCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{remainingCount} autres
                </Badge>
              )}
            </>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors",
                "hover:bg-gray-50",
                value.includes(option.value) && "bg-blue-50 text-blue-700",
              )}
              onClick={() => toggleOption(option.value)}
            >
              <span>{option.label}</span>
              {value.includes(option.value) && <Check className="h-4 w-4 text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
