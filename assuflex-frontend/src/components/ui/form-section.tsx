import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FormSectionProps {
  title: string
  description?: string
  icon: LucideIcon
  iconColor?: string
  children: React.ReactNode
}

export function FormSection({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  children,
}: FormSectionProps) {
  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200/60 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div>{title}</div>
            {description && <p className="text-sm font-normal text-gray-600 mt-1">{description}</p>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
