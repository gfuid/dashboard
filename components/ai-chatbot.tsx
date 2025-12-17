"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import type { ParsedData } from "./dashboard"

interface AiChatbotProps {
  data: ParsedData
  onClose: () => void
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AiChatbot({ data, onClose }: AiChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI data analyst assistant. I have access to your dataset with ${data.rows.length} records and ${data.headers.length} fields (${data.numericColumns.length} numeric, ${data.categoricalColumns.length} categorical).

Ask me anything like:
• "What are the key trends in this data?"
• "Which category has the highest values?"
• "Summarize the main insights"
• "What should I focus on?"`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Create detailed context
      const numericStats = data.numericColumns.slice(0, 3).map((col) => {
        const values = data.rows.map((r) => Number(r[col]) || 0)
        return {
          column: col,
          avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
          min: Math.min(...values).toFixed(2),
          max: Math.max(...values).toFixed(2),
        }
      })

      const dataContext = `
Dataset Overview:
- Total Records: ${data.rows.length}
- Total Fields: ${data.headers.length}
- Numeric Fields: ${data.numericColumns.join(", ")}
- Categorical Fields: ${data.categoricalColumns.join(", ")}

Numeric Statistics:
${numericStats.map((s) => `- ${s.column}: avg=${s.avg}, min=${s.min}, max=${s.max}`).join("\n")}

Sample Data (first 5 rows):
${JSON.stringify(data.rows.slice(0, 5), null, 2)}
`

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          dataContext,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const result = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: result.text }])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error processing your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 w-[400px] max-h-[550px] z-50 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <Card className="border border-border bg-card h-full flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-border bg-gradient-to-r from-teal-600 to-cyan-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              AI Data Analyst
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 text-white/80 hover:text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                    : "bg-secondary text-foreground border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-secondary border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                  <span className="text-sm text-muted-foreground">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t border-border flex-shrink-0 bg-card">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your data..."
              disabled={isLoading}
              className="flex-1 bg-secondary border-border"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
