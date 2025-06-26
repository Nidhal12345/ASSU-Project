import type React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  loadingText?: string
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} className={cn("transition-all duration-200", className)} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText || "Chargement..." : children}
    </Button>
  )
}
