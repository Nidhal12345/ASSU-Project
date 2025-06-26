import type React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
  description?: string
}

export function FormField({ label, required, error, children, className, description }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </Label>
      {description && <p className="text-xs text-gray-500 -mt-1">{description}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}
