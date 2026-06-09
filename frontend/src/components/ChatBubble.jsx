import React from "react"
import { Sparkles, User } from "lucide-react"
import { cn } from "@/utils/utils"

export default function ChatBubble({ role, content, timestamp }) {
  const isUser = role === "user"

  // Basic formatter for bold headers and bullets
  const formatMessage = (text) => {
    if (!text) return ""
    
    // Replace markdown bold **text** with HTML <strong>text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-800 dark:text-white">$1</strong>')
    
    // Highlight emergency indicators ⚠️
    formatted = formatted.replace(/⚠️(.*?)(\n|$)/g, '<div class="my-2 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 rounded-xl flex items-start gap-2 text-xs font-semibold leading-relaxed"><span>⚠️</span><span>$1</span></div>')

    // Parse list items
    const lines = formatted.split("\n")
    const processedLines = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return `<li class="ml-4 list-disc my-1 text-slate-650 dark:text-slate-300">${trimmed.substring(2)}</li>`
      }
      return line
    })

    return processedLines.join("<br />")
  }

  return (
    <div className={cn(
      "flex w-full gap-3 py-3 animate-in fade-in slide-in-from-bottom-2 duration-250",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl text-white shadow-xs",
        isUser 
          ? "bg-blue-600 dark:bg-teal-600" 
          : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      )}>
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-teal-400" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs",
        isUser
          ? "bg-blue-600 text-white rounded-tr-xs"
          : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-750 dark:text-slate-250 rounded-tl-xs"
      )}>
        <div 
          className="whitespace-pre-line prose prose-xs dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
        />
        
        {timestamp && (
          <span className={cn(
            "block text-[9px] mt-1.5 font-medium text-right select-none",
            isUser ? "text-blue-200" : "text-slate-400"
          )}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  )
}
