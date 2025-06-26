"use client"

import { useNavigate } from "react-router-dom"
import { XCircle, ArrowLeft, RefreshCw, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentCancel() {
  const navigate = useNavigate()

  const handleTryAgain = () => {
    // Navigate back to the payment page or previous page
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const handleGoToPayments = () => {
    navigate("/client/paiment")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">Your payment has been cancelled.</p>
            <p className="text-sm text-gray-500">No charges have been made to your account.</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Need help?</strong> If you encountered an issue during payment, please contact our support team.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleTryAgain} className="w-full bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleGoToPayments} className="flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Payments
              </Button>

              <Button variant="outline" onClick={handleGoHome} className="flex items-center justify-center">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Transaction ID: #TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p>If you continue to experience issues, please save this ID for reference.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
