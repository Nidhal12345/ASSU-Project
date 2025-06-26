
import type React from "react"
import { useState, useRef, useEffect, JSX } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Minus, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Suggestion {
  id: string
  text: string
  category?: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bonjour ! Je suis ASSU-BOT votre Assistant Assuflex. Comment puis-je vous aider avec vos besoins d'assurance santé aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generateSuggestions = (botResponse: string) => {
    const response = botResponse.toLowerCase()
    let newSuggestions: Suggestion[] = []

    if (response.includes("étudiant") || response.includes("jeune")) {
      newSuggestions = [
        { id: "1", text: "Quels sont les tarifs étudiants disponibles ?", category: "tarifs" },
        { id: "2", text: "Comment souscrire à une mutuelle étudiante ?", category: "souscription" },
        { id: "3", text: "Quelles sont les garanties essentielles pour un étudiant ?", category: "garanties" },
      ]
    } else if (response.includes("réclamation") || response.includes("sinistre")) {
      newSuggestions = [
        { id: "1", text: "Comment suivre ma réclamation en cours ?", category: "suivi" },
        { id: "2", text: "Quels documents fournir pour une réclamation ?", category: "documents" },
        { id: "3", text: "Combien de temps pour le remboursement ?", category: "délais" },
      ]
    } else if (response.includes("couverture") || response.includes("plan")) {
      newSuggestions = [
        { id: "1", text: "Comparer les différents plans disponibles", category: "comparaison" },
        { id: "2", text: "Qu'est-ce qui est inclus dans la couverture de base ?", category: "garanties" },
        { id: "3", text: "Comment changer de plan d'assurance ?", category: "modification" },
      ]
    } else {
      newSuggestions = [
        { id: "1", text: "Comment faire une réclamation ?", category: "réclamations" },
        { id: "2", text: "Quels sont vos plans d'assurance ?", category: "plans" },
        { id: "3", text: "Comment contacter le support client ?", category: "support" },
        { id: "4", text: "Où trouver un médecin dans le réseau ?", category: "réseau" },
      ]
    }

    setSuggestions(newSuggestions)
  }

  useEffect(() => {
    generateSuggestions("assistant assuflex")
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!messageText) setInputValue("")
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      const response = await fetch("http://localhost:8080/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promt: textToSend,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.text()

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data || "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])

      generateSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error)

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Désolé, je rencontre des difficultés techniques en ce moment. Veuillez réessayer dans quelques instants ou contactez notre support client.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorResponse])
      generateSuggestions("")
      setShowSuggestions(true)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatBotResponse = (content: string): JSX.Element => {
    const paragraphs = content.split(/\n\s*\n|\d+\.\s*\*\*/).filter(Boolean)

    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => {
          const trimmedParagraph = paragraph.trim()

          if (trimmedParagraph.includes("**") && trimmedParagraph.includes(":")) {
            const parts = trimmedParagraph.split("**")
            if (parts.length >= 3) {
              const title = parts[1]
              const description = parts[2].replace(/^\s*:\s*/, "").trim()

              return (
                <div key={index} className="mb-3">
                  <h4 className="font-semibold text-blue-700 mb-1 text-sm">
                    {index > 0 && `${index}. `}
                    {title}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed pl-2 border-l-2 border-blue-200">{description}</p>
                </div>
              )
            }
          }

          if (trimmedParagraph && !trimmedParagraph.includes("**")) {
            return (
              <p key={index} className="text-sm text-gray-700 leading-relaxed">
                {trimmedParagraph}
              </p>
            )
          }

          return null
        })}
      </div>
    )
  }

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-3 bg-blue-100 rounded-2xl rounded-bl-sm max-w-xs">
      <Bot className="w-4 h-4 text-blue-600" />
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  )

  const SuggestionButtons = () => (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          onClick={() => handleSendMessage(suggestion.text)}
          className="text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-full px-3 py-1 transition-colors"
        >
          {suggestion.text}
        </Button>
      ))}
    </div>
  )

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg z-50 transition-all duration-300 hover:scale-110"
          aria-label="Ouvrir l'Assistant Assuflex"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl z-50 transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[32rem]"
          }`}
          role="dialog"
          aria-labelledby="chatbot-title"
          aria-describedby="chatbot-description"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">A</span>
              </div>
              <div>
                <h3 id="chatbot-title" className="font-semibold text-sm">
                  Assistant Assuflex
                </h3>
                <p id="chatbot-description" className="text-xs opacity-90">
                  En ligne maintenant
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
                aria-label={isMinimized ? "Agrandir le chat" : "Réduire le chat"}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
                aria-label="Fermer le chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 h-80"
                role="log"
                aria-live="polite"
                aria-label="Messages du chat"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-sm ${message.sender === "user" ? "order-2" : "order-1"}`}>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-orange-100 text-gray-900 rounded-br-sm"
                            : "bg-blue-100 text-gray-900 rounded-bl-sm"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === "bot" && <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
                          {message.sender === "user" && (
                            <User className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0 order-2" />
                          )}
                          {message.sender === "bot" ? (
                            formatBotResponse(message.content)
                          ) : (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      </div>

                      <p
                        className={`text-xs text-gray-500 mt-1 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {showSuggestions && suggestions.length > 0 && !isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-sm">
                      <SuggestionButtons />
                    </div>
                  </div>
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <TypingIndicator />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="min-h-[2.5rem] max-h-32 resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      rows={1}
                      aria-label="Tapez votre message"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 h-10 w-10 rounded-lg transition-colors"
                    aria-label="Envoyer le message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
