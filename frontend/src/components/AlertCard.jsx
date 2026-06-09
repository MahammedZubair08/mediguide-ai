import React from "react"
import { AlertTriangle, PhoneCall, ArrowRight } from "lucide-react"

export default function AlertCard({ title, triageLevel, reasoning, recommendedAction, onDismiss }) {
  const isCritical = triageLevel === "CRITICAL"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/15 p-6 shadow-md animate-in fade-in zoom-in-95 duration-350">
      {/* Decorative pulse glow */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-rose-500/10 blur-xl animate-pulse" />
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Flashing Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 animate-pulse">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Warning Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-wider">
              {triageLevel || "CRITICAL ALERT"}
            </span>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
              Emergency Guidance Triage
            </span>
          </div>

          <h3 className="font-display text-lg font-extrabold text-rose-900 dark:text-rose-200">
            {title || "Life-Threatening Warning Signs Detected"}
          </h3>

          <p className="text-xs text-rose-800/80 dark:text-rose-300 leading-relaxed font-semibold">
            {reasoning || "Your symptoms may indicate an acute cardiovascular, pulmonary, or systemic crisis that requires immediate clinical evaluation."}
          </p>

          <div className="p-3.5 bg-white dark:bg-slate-900 border border-rose-150 dark:border-rose-950 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-bold">
            💡 Recommended Action: {recommendedAction || "Call 911 or head to the nearest Emergency Department immediately."}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="tel:911"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 text-xs font-extrabold text-white shadow-md transition-all hover:scale-102 hover:shadow-lg active:scale-98"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Emergency (911)</span>
            </a>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-rose-200 hover:bg-rose-100/30 px-4 text-xs font-bold text-rose-700 dark:text-rose-455 transition-all"
              >
                <span>Acknowledge & Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
