import React, { useState, useRef, useEffect } from "react"
import { Send, RefreshCw, Sparkles, MessageSquare, AlertTriangle } from "lucide-react"
import { apiService } from "@/services/api"
import ChatBubble from "@/components/ChatBubble"
import TypingIndicator from "@/components/TypingIndicator"
import AlertCard from "@/components/AlertCard"

export default function ChatDashboard() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [triageAlert, setTriageAlert] = useState(null)
  const [sessionId, setSessionId] = useState("")
  
  const messagesEndRef = useRef(null)

  const samplePrompts = [
    "I have fever and cough",
    "Explain my blood report",
    "What are dehydration symptoms?"
  ]

  // Initialize session and greeting
  useEffect(() => {
    const newSessionId = "chat_" + Date.now()
    setSessionId(newSessionId)
    
    // Load patient context
    const profile = JSON.parse(localStorage.getItem("mediguide_profile") || "{}")
    const name = profile.name || "Patient"
    const age = profile.age ? `, ${profile.age} years old` : ""
    
    const initialText = `Hello ${name}${age}! I am MediGuide AI, your clinical advisory assistant. How can I help you check symptoms or understand your health today?`
    
    setMessages([
      {
        role: "model",
        content: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Save/Update conversation session in localStorage
  const saveSessionToHistory = (msgs) => {
    try {
      const history = JSON.parse(localStorage.getItem("mediguide_history") || "[]")
      const existingIdx = history.findIndex(h => h.id === sessionId)
      
      const sessionRecord = {
        id: sessionId,
        type: "Chat Session",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        snippet: msgs[msgs.length - 1]?.content.substring(0, 80) + "...",
        messages: msgs
      }

      if (existingIdx !== -1) {
        history[existingIdx] = sessionRecord
      } else {
        history.unshift(sessionRecord)
      }
      localStorage.setItem("mediguide_history", JSON.stringify(history))
    } catch (err) {
      console.error("Could not write to local history:", err)
    }
  }

  const runTriage = async (text) => {
    try {
      const result = await apiService.triage(text)
      if (result.triage_level === "CRITICAL" || result.triage_level === "URGENT") {
        setTriageAlert(result)
      } else {
        setTriageAlert(null)
      }
    } catch (err) {
      console.warn("Triage warning screening offline.", err)
    }
  }

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input
    if (!queryText.trim()) return

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const updatedMsgs = [
      ...messages,
      { role: "user", content: queryText, timestamp: userTime }
    ]
    
    setMessages(updatedMsgs)
    setInput("")
    setLoading(true)

    // Run parallel triage safety assessment
    runTriage(queryText)

    try {
      // Send message history (excluding initial greeting to save tokens)
      const chatHistory = updatedMsgs.slice(1, -1)
      const res = await apiService.chat(queryText, chatHistory)
      
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const finalMsgs = [
        ...updatedMsgs,
        { role: "model", content: res.response, timestamp: aiTime }
      ]
      setMessages(finalMsgs)
      saveSessionToHistory(finalMsgs)
    } catch (error) {
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      // Fallback response simulating API key issues or offline server
      const offlineResponse = `⚠️ **System Advisory:** The backend AI server is offline. 

If this is a local setup issue, check that the FastAPI server is running on \`http://localhost:8000\`.

*Demo Fallback Guidance:*
For mild symptoms like common coughs or minor muscle soreness, rest and hydration are recommended. If you develop acute breathing issues, local pain, or high fever, please contact a clinic immediately.`
      
      const finalMsgs = [
        ...updatedMsgs,
        { role: "model", content: offlineResponse, timestamp: aiTime }
      ]
      setMessages(finalMsgs)
      saveSessionToHistory(finalMsgs)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    const profile = JSON.parse(localStorage.getItem("mediguide_profile") || "{}")
    const name = profile.name || "Patient"
    const newSessionId = "chat_" + Date.now()
    setSessionId(newSessionId)
    setTriageAlert(null)
    setMessages([
      {
        role: "model",
        content: `Hello ${name}! Let's start a fresh consultation. How can I help you evaluate symptoms today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-blue-600 dark:text-teal-400" />
          Clinical Symptom Chat
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          Evaluate symptoms, understand possible diagnostic outcomes, and receive guided health instructions safely.
        </p>
      </div>

      {/* Emergency alert card */}
      {triageAlert && (
        <AlertCard 
          title={`Alert Level: ${triageAlert.triage_level}`}
          triageLevel={triageAlert.triage_level}
          reasoning={triageAlert.reasoning}
          recommendedAction={triageAlert.recommended_action}
          onDismiss={() => setTriageAlert(null)}
        />
      )}

      {/* Grid: Chat Window + Suggestions */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Chat Feed */}
        <div className="lg:col-span-3 flex flex-col h-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Header toolbar */}
          <div className="flex h-14 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Assessment Feed
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 dark:text-teal-400 hover:underline"
              title="Start New Session"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/15 dark:bg-slate-950/5">
            {messages.map((msg, idx) => (
              <ChatBubble 
                key={idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your health symptoms (e.g. sharp headache since noon)..."
                disabled={loading}
                className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-teal-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white disabled:opacity-55 shadow-xs transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Suggested Queries panel */}
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 dark:text-teal-400" />
              <h4 className="text-xs font-extrabold font-display">Suggested Prompts</h4>
            </div>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal">
              Click any quick query scenario to immediately populate and query the AI checker.
            </p>
            <div className="space-y-2 pt-1">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="w-full text-left p-3 text-xs rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-500 hover:bg-blue-50/10 dark:hover:bg-teal-950/10 transition-all text-slate-600 dark:text-slate-450 font-medium"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Quick Safety Check */}
          <div className="p-5 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 font-display flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Emergency Reminder
            </h4>
            <p className="text-[10.5px] text-slate-500 leading-normal">
              Do not use chat if experiencing chest pain, facial paralysis, sudden numbness, or suffocating breathing distress. 
            </p>
            <a 
              href="/emergency" 
              className="text-[10px] font-extrabold text-rose-650 dark:text-rose-455 hover:underline block pt-1"
            >
              Access Emergency Support Dialers &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
