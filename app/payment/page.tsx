"use client"

import { useState, useEffect } from "react"
import { Search, CreditCard, Shield, Check, ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const planDetails = {
  pro: {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    features: [
      "Unlimited searches",
      "All search methods",
      "Advanced AI confidence scoring",
      "Premium movie database access",
      "Unlimited watchlist",
      "Personalized recommendations",
      "Priority support",
    ],
  },
  family: {
    name: "Family",
    price: "$19.99",
    period: "per month",
    features: [
      "Everything in Pro",
      "Up to 6 family accounts",
      "Shared family watchlists",
      "Parental controls",
      "Family movie recommendations",
      "Group viewing suggestions",
      "Multiple device support",
    ],
  },
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "family">("pro")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  useEffect(() => {
    // Get plan from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get("plan")
    if (plan === "family") {
      setSelectedPlan("family")
    }
  }, [])

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    // Redirect to success page or dashboard
    alert("Payment successful! Welcome to MovieDetect " + planDetails[selectedPlan].name)
  }

  const currentPlan = planDetails[selectedPlan]

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-black to-emerald-900/10" />

      <div className="relative">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              MovieDetect
            </span>
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
        </nav>

        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Complete Your Purchase</h1>
                <p className="text-gray-400 mt-2">You're just one step away from unlimited movie discovery</p>
              </div>

              {/* Plan Selection */}
              <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Selected Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{currentPlan.name[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{currentPlan.name} Plan</h3>
                        <p className="text-gray-400">
                          {currentPlan.price} {currentPlan.period}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlan(selectedPlan === "pro" ? "family" : "pro")}
                      className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      Change Plan
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-white">What's included:</h4>
                    <ul className="space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-white">
                        {currentPlan.price}/{currentPlan.period.split(" ")[1]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">14-day free trial • Cancel anytime</p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secured by 256-bit SSL encryption</span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Payment Method</CardTitle>
                  <CardDescription className="text-gray-400">Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="flex space-x-4">
                    <Button
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                      className={
                        paymentMethod === "card"
                          ? "flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                          : "flex-1 border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                      }
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Credit Card
                    </Button>
                    <Button
                      variant={paymentMethod === "paypal" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("paypal")}
                      className={
                        paymentMethod === "paypal"
                          ? "flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                          : "flex-1 border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                      }
                    >
                      PayPal
                    </Button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Card Number</label>
                        <Input
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                          <Input
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">CVC</label>
                          <Input
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                            placeholder="123"
                            className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Cardholder Name</label>
                        <Input
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="John Doe"
                          className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">PP</span>
                      </div>
                      <p className="text-gray-300">You'll be redirected to PayPal to complete your payment</p>
                    </div>
                  )}

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-3 text-lg"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Start Free Trial
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-400">
                    <p>
                      By continuing, you agree to our{" "}
                      <Link href="/terms" className="text-teal-400 hover:text-teal-300">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-teal-400 hover:text-teal-300">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
