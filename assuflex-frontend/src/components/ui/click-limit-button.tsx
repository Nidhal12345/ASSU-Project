import { Button } from "@/components/ui/button"
import { ButtonProps } from "@/components/ui/button"
import { useState } from "react"
import toast from "react-hot-toast"

interface ClickLimitButtonProps extends ButtonProps {
  maxClicks?: number
  limitMessage?: string
  children: React.ReactNode
}

export function ClickLimitButton({
  maxClicks = 3,
  limitMessage = "Veuillez patienter avant de cliquer à nouveau",
  children,
  onClick,
  ...props
}: ClickLimitButtonProps) {
  const [clickCount, setClickCount] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      toast.error(limitMessage)
      return
    }

    setClickCount((prev) => {
      const newCount = prev + 1
      if (newCount >= maxClicks) {
        setIsDisabled(true)
        toast.error(limitMessage)
      }
      return newCount
    })

    onClick?.(e)
  }

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={isDisabled || props.disabled}
    >
      {children}
    </Button>
  )
} 