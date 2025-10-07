"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip } from "lucide-react"

function CustomerChatContent() {
  const params = useParams()
  const { user, token } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChatData()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatData = async () => {
    setLoading(true)
    try {
      const [quotationRes, messagesRes] = await Promise.all([
        fetch(`/api/quotations/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/chat/${params.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const quotationData = await quotationRes.json()
      const messagesData = await messagesRes.json()

      setQuotation(quotationData.quotation)
      setMessages(messagesData.messages)
    } catch (error) {
      console.error("Failed to fetch chat data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${params.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/chat/${params.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        // simulate provider typing before new messages arrive
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          fetchMessages()
        }, 800)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={quotation?.provider?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{quotation?.provider?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">{quotation?.provider?.name}</h1>
                <p className="text-sm text-muted-foreground">{quotation?.service}</p>
              </div>
            </div>
            <Badge>{quotation?.status}</Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-5xl h-full px-4 sm:px-6 lg:px-8">
          <div className="h-[calc(100vh-280px)] overflow-y-auto py-6 space-y-2">
            {messages.map((message) => {
              const mine = message.senderId === user?.id
              return (
                <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 transition-all ${
                      mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">{message.timestamp}</p>
                  </div>
                </div>
              )
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-3 py-2 text-xs text-muted-foreground animate-pulse">
                  Provider is typing…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Button type="button" variant="outline" size="icon" aria-label="Attach a file">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CustomerChatPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CustomerChatContent />
    </ProtectedRoute>
  )
}
