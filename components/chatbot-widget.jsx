"use client"
import { useState } from "react"

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! How can I help you today?" }])
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input.trim() }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.content }),
      })
      const data = await res.json()
      if (data?.text) {
        setMessages((m) => [...m, { role: "assistant", content: data.text }])
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "Sorry, I ran into an issue replying." }])
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-40 rounded-full px-4 py-2 text-sm font-medium text-black hover:bg-white bg-chart-3 border-secondary-foreground shadow-xl"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chatbot-panel"
      >
        {open ? "Close Chat" : "Chat"}
      </button>
      {open && (
        <div
          id="chatbot-panel"
          className="fixed bottom-20 right-5 z-40 w-80 rounded-lg p-3 outline outline-1 outline-[rgba(255,255,255,0.08)] shadow-xl bg-sidebar-border border-[rgba(15,14,14,1)]"
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-2 max-h-64 space-y-2 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-md bg-[rgba(255,255,255,0.12)] px-2 py-1 text-sm"
                    : "max-w-[85%] rounded-md bg-[rgba(255,255,255,0.06)] px-2 py-1 text-sm"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground">Thinking…</div>}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="flex-1 rounded-md px-2 py-2 text-sm outline outline-1 outline-[rgba(255,255,255,0.08)] text-foreground bg-card border-sidebar-accent-foreground"
            />
            <button
              onClick={send}
              className="rounded-md bg-[rgba(255,255,255,0.92)] px-3 py-2 text-black hover:bg-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
