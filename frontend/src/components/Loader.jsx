import React from "react"
import { Activity } from "lucide-react"
import { cn } from "@/utils/utils"

export default function Loader({ fullscreen = false, text = "Loading MediGuide AI..." }) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* Outer rings */}
            <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/10 dark:bg-teal-500/10 duration-1000" />
            <div className="absolute h-12 w-12 rounded-full border-2 border-blue-500/20 dark:border-teal-500/20" />
            
            {/* Main pulsing pulse indicator */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
              <Activity className="h-7 w-7 text-blue-600 dark:text-teal-400 animate-pulse" />
            </div>
          </div>
          <span className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200 animate-pulse tracking-wide">
            {text}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      {text && (
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {text}
        </span>
      )}
    </div>
  )
}
