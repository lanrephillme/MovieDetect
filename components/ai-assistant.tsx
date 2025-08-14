"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

const aiResponses = [
  "I can help you describe movies more effectively! Try being specific about genres, actors, or memorable scenes.",
  "For better search results, mention visual elements like colors, settings, or distinctive costumes you remember.",
  "If you remember a quote or dialogue, that's perfect for text search. Even partial quotes work great!",
  "Describe the mood or atmosphere - was it dark and mysterious, bright and colorful, or action-packed?",
  "Time period details help a lot - modern day, historical, futuristic, or a specific decade?",
  "Character descriptions are valuable - their appearance, personality, or role in the story.",
  "Think about the movie's theme - romance, revenge, coming-of-age, survival, or mystery?",
  "Location details matter - was it set in a city, countryside, space, underwater, or fantasy world?",
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm VisionAI, your movie search assistant. I help you find movies by improving your descriptions. What are you trying to remember?",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up or at top
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("genre") || lowerMessage.includes("type")) {
      return "Great! Genres are super helpful. You can also mention sub-genres like 'psychological thriller' or 'romantic comedy' for more precise results."
    }

    if (lowerMessage.includes("actor") || lowerMessage.includes("actress") || lowerMessage.includes("star")) {
      return "Perfect! Actor names are excellent search terms. Even if you're not sure of the exact name, describe their appearance or other movies they've been in."
    }

    if (lowerMessage.includes("scene") || lowerMessage.includes("part")) {
      return "Scene descriptions work wonderfully! Try to include details like the setting, what characters were doing, or any memorable dialogue from that scene."
    }

    if (lowerMessage.includes("music") || lowerMessage.includes("song") || lowerMessage.includes("soundtrack")) {
      return "Music is a great clue! You can use our audio search feature to hum or play the tune, or describe the style of music and when it played in the movie."
    }

    if (lowerMessage.includes("year") || lowerMessage.includes("old") || lowerMessage.includes("when")) {
      return "Time period is very useful! Even if you're not sure of the exact year, mentioning the decade or era (like '90s action movie' or 'classic film') helps narrow it down."
    }

    // Return a random helpful response
    return aiResponses[Math.floor(Math.random() * aiResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: generateAIResponse(message),
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isVisible && !isOpen) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card
          className={`w-80 md:w-96 bg-[#1F2937] border-[#00E6E6] shadow-2xl transition-all duration-300 ${
            isMinimized ? "h-16" : "h-96"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-[#00E6E6]/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00E6E6] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#0B0E17]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">VisionAI</h3>
                <p className="text-xs text-[#B3B3B3]">Movie Search Assistant</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-[#B3B3B3] hover:text-[#00E6E6] p-1 h-auto"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-[#B3B3B3] hover:text-red-400 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.type === "assistant" && (
                        <div className="w-6 h-6 bg-[#00E6E6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-[#0B0E17]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.type === "user" ? "bg-[#00E6E6] text-[#0B0E17] ml-auto" : "bg-[#0B0E17] text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.type === "user" && (
                        <div className="w-6 h-6 bg-[#B3B3B3] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3 h-3 text-[#0B0E17]" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 bg-[#00E6E6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-[#0B0E17]" />
                      </div>
                      <div className="bg-[#0B0E17] text-white p-3 rounded-lg text-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#00E6E6] rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-[#00E6E6] rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#00E6E6] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="p-4 border-t border-[#00E6E6]/20">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe what you're looking for..."
                    className="bg-[#0B0E17] border-[#00E6E6]/30 text-white placeholder:text-[#B3B3B3] focus:border-[#00E6E6]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
