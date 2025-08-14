"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Minimize2, Maximize2, Sparkles } from "lucide-react"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm VisionAI, your movie discovery assistant. I can help you improve your movie descriptions to get better search results. What movie are you trying to find?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY.current

      if (isScrollingDown && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("action") || input.includes("fight") || input.includes("explosion")) {
      return "Great! For action movies, try describing specific elements like: the type of action (martial arts, gunfights, car chases), the setting (modern city, historical period, futuristic), or memorable scenes. You could also mention the main actor or director if you remember them."
    }

    if (input.includes("comedy") || input.includes("funny") || input.includes("laugh")) {
      return "Comedy searches work well with details about the humor style! Try mentioning: the type of comedy (romantic, slapstick, dark humor), the setting or time period, memorable quotes or scenes, or the main actors. Even describing the general plot or situation can help!"
    }

    if (input.includes("horror") || input.includes("scary") || input.includes("monster")) {
      return "Horror movie searches benefit from specific details! Describe: the type of horror (psychological, supernatural, slasher), the monster or threat, the setting (haunted house, forest, city), or any memorable scary scenes. Time period and visual style also help narrow it down."
    }

    if (input.includes("old") || input.includes("classic") || input.includes("vintage")) {
      return "For older movies, try including: the approximate decade or year, whether it's black & white or color, the genre, main actors you remember, or distinctive visual elements. Even vague memories like 'the one with the famous dance scene' can help!"
    }

    if (input.includes("animated") || input.includes("cartoon") || input.includes("disney")) {
      return "Animated movie searches work great with: the animation style (2D, 3D, stop-motion), target audience (kids, adults), main characters or animals, the setting or world, memorable songs, or the studio that made it. Even describing the art style helps!"
    }

    if (input.includes("sci-fi") || input.includes("space") || input.includes("future") || input.includes("robot")) {
      return "Sci-fi searches benefit from specific elements! Try describing: the setting (space, future Earth, other planets), technology featured (robots, time travel, aliens), the visual style, or memorable scenes. Even the 'feel' of the movie (dark, optimistic, action-packed) helps!"
    }

    if (input.includes("romance") || input.includes("love") || input.includes("romantic")) {
      return "Romance movie searches work well with context! Describe: the setting or time period, the type of romance (forbidden love, enemies to lovers, second chances), memorable scenes or quotes, or the main actors. Even the mood (light-hearted, dramatic, tragic) helps!"
    }

    if (input.includes("remember") || input.includes("scene") || input.includes("part")) {
      return "Perfect! Describing specific scenes is very effective. Try to include: what happens in the scene, the setting or location, what the characters are wearing or doing, any dialogue you remember, or the emotions/mood of the scene. Even small details can lead to the right movie!"
    }

    if (input.includes("actor") || input.includes("actress") || input.includes("star")) {
      return "Actor-based searches are great! If you can't remember the name, try describing: their appearance, other movies they've been in, their acting style, or their role in the movie. You can also use our face search feature to upload a photo of the actor!"
    }

    if (input.includes("music") || input.includes("song") || input.includes("soundtrack")) {
      return "Music-based searches are powerful! Try describing: the genre of music, memorable lyrics, when the song plays in the movie, the mood it creates, or even humming the tune using our audio search feature. Movie soundtracks are often very distinctive!"
    }

    // Default responses for general queries
    const defaultResponses = [
      "That's a great start! To improve your search, try adding more specific details like the time period, genre, main actors, or memorable scenes. The more details you provide, the better our AI can help you find the exact movie!",
      "I can help you refine that description! Consider mentioning the movie's setting, visual style, or any distinctive elements you remember. You can also try our different search methods - voice, image, or even face recognition!",
      "Good description! To make it even better, try including details about the plot, characters, or any memorable quotes. You could also describe the movie's mood or atmosphere - was it dark and serious or light and fun?",
      "Nice! Let's make your search more specific. Think about the genre, time period when it was made, or any unique visual elements. Even describing how the movie made you feel can help narrow down the results!",
      "That's helpful information! To enhance your search, consider adding details about the cast, director, or production style. You can also describe specific scenes or plot points that stood out to you.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  if (!isVisible && !isOpen) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] rounded-full w-14 h-14 shadow-lg hover:shadow-[#00E6E6]/25 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card
          className={`w-80 bg-[#1F2937] border-[#00E6E6] shadow-xl transition-all duration-300 ${
            isMinimized ? "h-16" : "h-96"
          }`}
        >
          <CardHeader className="pb-2 px-4 py-3 bg-[#00E6E6] text-[#0B0E17] rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <CardTitle className="text-sm font-semibold">VisionAI Assistant</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-[#0B0E17] hover:bg-[#00CCCC] w-6 h-6 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-[#0B0E17] hover:bg-[#00CCCC] w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.isUser
                            ? "bg-[#00E6E6] text-[#0B0E17]"
                            : "bg-[#0B0E17] text-white border border-[#00E6E6]/20"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#0B0E17] text-white border border-[#00E6E6]/20 p-3 rounded-lg text-sm">
                        <div className="flex space-x-1">
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
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-[#00E6E6]/20">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Describe the movie you're looking for..."
                    className="bg-[#0B0E17] border-[#00E6E6]/20 text-white placeholder-[#B3B3B3] focus:border-[#00E6E6] text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
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
