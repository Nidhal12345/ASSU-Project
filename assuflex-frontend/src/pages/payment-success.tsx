"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/client/paiements")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 20
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
    }
  }, [navigate])

  const handleRedirectNow = () => {
    navigate("/client/paiment")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">Your payment has been processed successfully.</p>
            <p className="text-sm text-gray-500">Transaction completed and confirmed.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Redirecting in {countdown} seconds...</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          <div className="space-y-3">
            <Button onClick={handleRedirectNow} className="w-full bg-green-600 hover:bg-green-700">
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-gray-500">You will be automatically redirected to the client payment section.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
