"use client"

import { Search, Check, Star, ArrowLeft, Zap, Crown, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual movie discovery",
    icon: Star,
    features: [
      "5 searches per day",
      "Basic scene description search",
      "Actor/actress search",
      "Standard movie database access",
      "Basic watchlist (up to 50 movies)",
      "Community features",
    ],
    limitations: ["No audio recognition", "No image/video upload", "Limited AI confidence scoring", "Standard support"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Unlimited AI-powered movie discovery",
    icon: Zap,
    features: [
      "Unlimited searches",
      "All search methods (scene, actor, audio, image, video)",
      "Advanced AI confidence scoring",
      "Premium movie database access",
      "Unlimited watchlist with categories",
      "Personalized recommendations",
      "Priority support",
      "Export watchlists",
      "Advanced filters and sorting",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Family",
    price: "$19.99",
    period: "per month",
    description: "Perfect for families and movie groups",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Up to 6 family accounts",
      "Shared family watchlists",
      "Parental controls and content filtering",
      "Family movie recommendations",
      "Group viewing suggestions",
      "Multiple device support",
      "Family activity dashboard",
      "Custom user profiles",
    ],
    limitations: [],
    cta: "Start Family Plan",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For businesses and content creators",
    icon: Building,
    features: [
      "Everything in Family",
      "Unlimited team members",
      "API access for integrations",
      "Custom branding options",
      "Advanced analytics and reporting",
      "Dedicated account manager",
      "SLA guarantees",
      "Custom integrations",
      "Bulk operations",
      "White-label solutions",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  const handlePlanSelect = (planName: string) => {
    if (planName === "Free") {
      // Redirect to signup
      window.location.href = "/signup"
    } else if (planName === "Enterprise") {
      // Redirect to contact
      window.location.href = "/contact"
    } else {
      // Redirect to payment with plan selection
      window.location.href = `/payment?plan=${planName.toLowerCase()}`
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
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

          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Choose Your
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                {" "}
                Movie Discovery
              </span>{" "}
              Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From casual browsing to professional content discovery, we have the perfect plan for your movie search
              needs.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={index}
                    className={`relative bg-black/40 backdrop-blur-md border-gray-800 hover:border-teal-500/50 transition-all duration-300 ${
                      plan.popular ? "ring-2 ring-teal-500/50 scale-105" : ""
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                        Most Popular
                      </Badge>
                    )}

                    <CardHeader className="text-center space-y-4">
                      <div
                        className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                          plan.popular
                            ? "bg-gradient-to-br from-teal-500 to-emerald-500"
                            : "bg-gradient-to-br from-teal-500/20 to-emerald-500/20"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${plan.popular ? "text-white" : "text-teal-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-white">{plan.price}</span>
                          {plan.period !== "contact us" && <span className="text-gray-400 ml-1">/{plan.period}</span>}
                        </div>
                        <CardDescription className="text-gray-400 mt-2">{plan.description}</CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <Button
                        onClick={() => handlePlanSelect(plan.name)}
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                            : "bg-black/50 border border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Features included:</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-sm text-gray-300">
                              <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {plan.limitations.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-800">
                          <h4 className="font-semibold text-gray-400">Limitations:</h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, limitationIndex) => (
                              <li key={limitationIndex} className="flex items-start space-x-2 text-sm text-gray-500">
                                <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                                  <div className="w-1 h-1 bg-gray-500 rounded-full mx-auto mt-1.5" />
                                </div>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 py-16 bg-gradient-to-r from-teal-900/10 to-emerald-900/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Can I change plans anytime?</h3>
                <p className="text-gray-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                  prorate any billing differences.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Is there a free trial?</h3>
                <p className="text-gray-400">
                  Pro and Family plans come with a 14-day free trial. No credit card required to start your trial.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What payment methods do you accept?</h3>
                <p className="text-gray-400">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Can I cancel anytime?</h3>
                <p className="text-gray-400">
                  Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access
                  continues until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Still Have Questions?</h2>
            <p className="text-xl text-gray-300">Our team is here to help you choose the perfect plan</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3 text-lg">
                  Contact Sales
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 px-8 py-3 text-lg bg-transparent"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
