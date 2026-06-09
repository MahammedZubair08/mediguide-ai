import React from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  Home,
  MessageSquare, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Settings, 
  X, 
  Activity,
  ChevronRight
} from "lucide-react"
import { cn } from "@/utils/utils"

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const menuItems = [
    { name: "Landing Page", path: "/", icon: Home },
    { name: "Chat Dashboard", path: "/chat", icon: MessageSquare },
    { name: "Report Summarizer", path: "/upload", icon: FileText },
    { name: "Emergency Portal", path: "/emergency", icon: AlertTriangle, urgent: true },
    { name: "Consultation History", path: "/history", icon: Clock },
    { name: "Settings & API", path: "/settings", icon: Settings },
  ]

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col shrink-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold text-blue-600 dark:text-teal-400">
          <Activity className="h-6 w-6 text-blue-600 dark:text-teal-400 animate-pulse-slow" />
          <span>MediGuide AI</span>
        </Link>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group",
                isActive 
                  ? item.urgent
                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold"
                    : "bg-blue-50 dark:bg-teal-950/40 text-blue-600 dark:text-teal-400 font-bold" 
                  : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110", 
                isActive 
                  ? item.urgent 
                    ? "text-rose-600 dark:text-rose-455" 
                    : "text-blue-600 dark:text-teal-400" 
                  : "text-slate-400 dark:text-slate-550 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <ChevronRight className={cn(
                  "ml-auto h-4 w-4", 
                  item.urgent ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-teal-455"
                )} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900">
          <div className="text-[10px] text-slate-500 leading-normal text-center font-medium">
            AI Advisory System. Don't use in case of active health emergency.
          </div>
        </div>
      </div>
    </aside>
  )
}
