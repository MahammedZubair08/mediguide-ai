import React from "react"
import { Sparkles } from "lucide-react"

export default function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 py-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
      {/* Bot Avatar */}
      <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-teal-400 shadow-xs">
        <Sparkles className="h-5 w-5 text-blue-600 dark:text-teal-400 animate-pulse-slow" />
      </div>

      {/* Typing Bubble */}
      <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3.5 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
